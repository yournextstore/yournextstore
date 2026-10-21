"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
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
		<div className="flex items-start justify-between gap-4">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative size-25 shrink-0 overflow-hidden rounded-lg border-[1.5px] border-brand bg-[#f4ebdb]"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="100px" />}
			</Link>

			<div className="flex w-full min-w-0 flex-col items-start gap-4">
				<div className="flex w-full justify-between gap-3">
					<div className="min-w-0">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="text-b-lg leading-[1.3] hover:underline"
						>
							{product.name}
						</Link>
						{options && <p className="mt-1 text-b-sm">{options}</p>}
						{item.subscriptionPlan && <p className="mt-1 text-b-sm">{planLabel(item.subscriptionPlan)}</p>}
					</div>
					<span className="text-b-md font-semibold tabular-nums">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</span>
				</div>

				<div className="flex w-full items-center justify-between gap-4">
					<div
						className={cn(
							"flex h-10 w-32 items-center justify-center gap-1 overflow-hidden rounded-lg border border-brand transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							className="flex h-full flex-1 items-center justify-center hover:bg-blush"
							aria-label="Decrease quantity"
						>
							<Minus aria-hidden="true" className="size-3" strokeWidth={2} />
						</button>
						<span className="flex-1 text-center text-b-md tabular-nums">{quantity}</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex h-full flex-1 items-center justify-center hover:bg-blush"
							aria-label="Increase quantity"
						>
							<Plus aria-hidden="true" className="size-3" strokeWidth={2} />
						</button>
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="inline-flex size-8 items-center justify-center disabled:pointer-events-none disabled:opacity-50"
						aria-label={`Remove ${product.name}`}
					>
						<Trash2 aria-hidden="true" className="size-6" strokeWidth={1.5} />
					</button>
				</div>
			</div>
		</div>
	);
}
