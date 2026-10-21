"use client";

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
		<div className={cn("mb-5 flex gap-5 transition-opacity", isPending && "opacity-70")}>
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				tabIndex={-1}
				aria-hidden="true"
				className="relative h-[92px] w-[92px] shrink-0 overflow-hidden bg-tile"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="92px" />}
			</Link>

			<div className="min-w-0 flex-1">
				<Link
					href={`/product/${product.slug}`}
					onClick={closeCart}
					className="hover:underline underline-offset-4"
				>
					{product.name}
				</Link>
				{options && <p className="mt-1 font-light text-muted-foreground text-sm">{options}</p>}
				{item.subscriptionPlan && (
					<p className="mt-1 font-light text-muted-foreground text-sm">{planLabel(item.subscriptionPlan)}</p>
				)}
				<div className="my-2 flex flex-wrap items-center gap-3">
					<div className="flex w-24 border-2 border-border">
						<button
							type="button"
							onClick={handleDecrement}
							className="h-7 w-8 shrink-0 font-semibold text-xl leading-none"
							aria-label="Decrease quantity"
						>
							-
						</button>
						<span className="flex w-full items-center justify-center text-lg tabular-nums">{quantity}</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="h-7 w-8 shrink-0 font-semibold text-xl leading-none"
							aria-label="Increase quantity"
						>
							+
						</button>
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="font-light hover:underline disabled:pointer-events-none"
					>
						Remove<span className="sr-only"> {product.name}</span>
					</button>
				</div>
			</div>

			<p className="shrink-0 text-right">{formatMoney({ amount: lineTotal, currency, locale })}</p>
		</div>
	);
}
