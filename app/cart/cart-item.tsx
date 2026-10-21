"use client";

import { Minus, Plus, X } from "lucide-react";
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
		<li className="flex gap-4 py-6">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				tabIndex={-1}
				aria-hidden="true"
				className="relative h-32 w-24 shrink-0 overflow-hidden bg-secondary"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="96px" />}
			</Link>

			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<div className="relative pr-9">
					<Link
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="line-clamp-2 text-sm text-gray-700 hover:text-black"
					>
						{product.name}
					</Link>
					{options && <p className="mt-1 text-xs text-gray-600">{options}</p>}
					{item.subscriptionPlan && (
						<p className="mt-1 text-xs text-gray-600">{planLabel(item.subscriptionPlan)}</p>
					)}
					<p className="mt-1 text-sm">{formatMoney({ amount: price, currency, locale })}</p>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center text-gray-600 transition-colors hover:text-black disabled:pointer-events-none disabled:opacity-50"
						aria-label={`Remove ${product.name}`}
					>
						<X className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>

				<div className="flex items-center justify-between gap-3">
					<div
						className={cn(
							"inline-flex items-center border border-black/30 transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
							aria-label="Decrease quantity"
						>
							<Minus className="h-3 w-3" aria-hidden="true" />
						</button>
						<span className="flex h-8 w-8 items-center justify-center text-sm tabular-nums">{quantity}</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
							aria-label="Increase quantity"
						>
							<Plus className="h-3 w-3" aria-hidden="true" />
						</button>
					</div>
					<span className="text-sm font-bold">{formatMoney({ amount: lineTotal, currency, locale })}</span>
				</div>
			</div>
		</li>
	);
}
