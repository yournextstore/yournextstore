"use client";

import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type Cart, type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { itemKey, lineOptions, planLabel } from "@/app/cart/cart-math";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type CartItemProps = {
	item: CartLineItem;
};

export function CartItem({ item }: CartItemProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { dispatch, closeCart, startMutation, syncCart, reconcile } = useCart();
	const [isPending, startTransition] = useTransition();

	const { productVariant, quantity } = item;
	const { product } = productVariant;
	const options = lineOptions(item);

	const image = getProductThumbnail(productVariant.images) ?? getProductThumbnail(product.images);
	const price = getLineItemUnitPrice(item, taxBehavior);
	const lineTotal = price * BigInt(quantity);

	const targetQuantityRef = useRef<number | null>(null);
	const sendQueueRef = useRef<Promise<void>>(Promise.resolve());
	const latestCartRef = useRef<Cart | null>(null);
	const sendFailedRef = useRef(false);

	// Optimistic update + queued sync: rapid clicks collapse into the newest absolute
	// quantity (safe thanks to mode "set"), one request in flight per line, and each
	// transition stays open until the queue drains so the value never flickers back.
	const updateQuantity = (action: Parameters<typeof dispatch>[0], target: number) => {
		// Mirror this line's pending window onto the cart-wide `isMutating` flag so the
		// Checkout link stays blocked while the write is in flight. `done` resolves when
		// the local transition finishes; the work itself only runs once.
		const { promise: done, resolve: resolveDone } = Promise.withResolvers<void>();
		startMutation(async () => {
			await done;
		});
		startTransition(async () => {
			try {
				dispatch(action);
				targetQuantityRef.current = target;
				sendQueueRef.current = sendQueueRef.current.then(async () => {
					const latest = targetQuantityRef.current;
					if (latest === null) {
						return; // newest value already sent
					}
					targetQuantityRef.current = null;
					const res = await setCartQuantity(productVariant.id, latest, item.subscriptionPlanId);
					// Remember the newest server-returned cart so we can sync from it (never
					// refetch — cartGet hits a read replica and can rebase stale).
					if (res.success && res.cart) {
						latestCartRef.current = res.cart;
					} else {
						sendFailedRef.current = true;
					}
				});
				// Drain the queue, then reconcile once. Concurrent transitions land here
				// together, so this runs a single sync per batch.
				let tail: Promise<void>;
				do {
					tail = sendQueueRef.current;
					await tail;
				} while (tail !== sendQueueRef.current);
				if (sendFailedRef.current) {
					sendFailedRef.current = false;
					latestCartRef.current = null;
					await reconcile();
				} else if (latestCartRef.current) {
					syncCart(latestCartRef.current);
					latestCartRef.current = null;
				}
			} finally {
				resolveDone();
			}
		});
	};

	const handleRemove = () => {
		updateQuantity({ type: "REMOVE", key: itemKey(item) }, 0);
	};

	const handleIncrement = () => {
		updateQuantity({ type: "INCREASE", key: itemKey(item) }, quantity + 1);
	};

	const handleDecrement = () => {
		if (quantity <= 1) {
			handleRemove();
			return;
		}
		updateQuantity({ type: "DECREASE", key: itemKey(item) }, quantity - 1);
	};

	return (
		<li className="flex items-start gap-[18px] border-t border-line py-4">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="hatch relative aspect-[4/5] w-[58px] flex-none overflow-hidden border border-line"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="58px" />}
			</Link>

			<div
				className={cn("flex min-w-0 flex-1 flex-col gap-1.5 transition-opacity", isPending && "opacity-70")}
			>
				<Link
					href={`/product/${product.slug}`}
					onClick={closeCart}
					className="font-sf text-[17px] leading-[1.3] hover:text-acc"
				>
					{product.name}
				</Link>
				{options && <span className="font-mono text-[11px] text-soft">{options}</span>}
				{item.subscriptionPlan && (
					<span className="font-mono text-[11px] text-soft">{planLabel(item.subscriptionPlan)}</span>
				)}
				<span className="font-mono text-[11px] text-faint">
					{quantity} × {formatMoney({ amount: price, currency, locale })} ·{" "}
					<span className="text-ink">{formatMoney({ amount: lineTotal, currency, locale })}</span>
				</span>
				<div className="eti flex items-center gap-4">
					<span className="flex items-center">
						<button
							type="button"
							onClick={handleDecrement}
							className="flex size-6 cursor-pointer items-center justify-center text-soft hover:text-acc"
							aria-label="Decrease quantity"
						>
							<Minus aria-hidden className="size-3" />
						</button>
						<span className="w-6 text-center font-mono tabular-nums text-ink">{quantity}</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex size-6 cursor-pointer items-center justify-center text-soft hover:text-acc"
							aria-label="Increase quantity"
						>
							<Plus aria-hidden className="size-3" />
						</button>
					</span>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="cursor-pointer py-1 uppercase text-faint transition hover:text-acc disabled:pointer-events-none"
					>
						Remove
					</button>
				</div>
			</div>
		</li>
	);
}
