"use client";

import { Check, Minus, Plus, X } from "lucide-react";
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

	// productCartItem: photo, name, "In Stock", a small quantity box and the price.
	return (
		<div className="flex gap-4 py-5">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-24"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="96px" />}
			</Link>

			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0 space-y-1">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="line-clamp-2 text-base font-semibold leading-snug text-slate-ink hover:underline"
						>
							{product.name}
						</Link>
						{options && <p className="text-sm text-slate-body">{options}</p>}
						{item.subscriptionPlan && (
							<p className="text-sm text-slate-body">{planLabel(item.subscriptionPlan)}</p>
						)}
					</div>
					<span className="shrink-0 text-base font-semibold text-slate-ink">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</span>
				</div>

				<p className="mt-2 flex items-center gap-1.5 text-xs text-slate-ink">
					<Check className="h-3.5 w-3.5 text-[#0f7a4c]" aria-hidden />
					In Stock
				</p>

				<div className="mt-auto flex items-center justify-between pt-3">
					<div
						className={cn(
							"inline-flex items-center rounded-md border border-slate-line bg-white shadow-xs-ae transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-ink hover:bg-secondary"
							aria-label="Decrease quantity"
						>
							<Minus className="h-3 w-3" />
						</button>
						<span className="flex h-8 w-8 items-center justify-center text-sm tabular-nums text-slate-ink">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-ink hover:bg-secondary"
							aria-label="Increase quantity"
						>
							<Plus className="h-3 w-3" />
						</button>
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="inline-flex items-center gap-1 p-1 text-sm text-slate-body transition-colors hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
						aria-label="Remove item"
					>
						<X className="h-4 w-4" aria-hidden />
						Remove
					</button>
				</div>
			</div>
		</div>
	);
}
