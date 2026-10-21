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

	const step =
		"flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-gray-100 text-xs disabled:cursor-not-allowed disabled:opacity-50";

	return (
		<div className={cn("flex gap-4 rounded-sm bg-white/60 p-4 shadow-sm", isPending && "opacity-80")}>
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-well"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="80px" />}
			</Link>

			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 space-y-0.5">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="line-clamp-2 text-lg leading-tight font-semibold hover:underline"
						>
							{product.name}
						</Link>
						{options && <p className="text-sm text-gray-600">{options}</p>}
						{item.subscriptionPlan && (
							<p className="text-sm text-gray-600">{planLabel(item.subscriptionPlan)}</p>
						)}
					</div>
					<span className="shrink-0">{formatMoney({ amount: lineTotal, currency, locale })}</span>
				</div>

				<div className="flex items-center gap-2 text-sm">
					<span className="text-gray-700">Quantity:</span>
					<button type="button" onClick={handleDecrement} className={step} aria-label="Decrease quantity">
						<Minus className="h-3 w-3" aria-hidden />
					</button>
					<span className="flex h-6 w-9 items-center justify-center rounded-sm bg-black/[0.075] tabular-nums">
						{quantity}
					</span>
					<button type="button" onClick={handleIncrement} className={step} aria-label="Increase quantity">
						<Plus className="h-3 w-3" aria-hidden />
					</button>
				</div>
				<button
					type="button"
					onClick={handleRemove}
					disabled={isPending}
					className="btn-rounded-secondary self-start px-4 py-1 text-xs sm:text-sm"
				>
					Remove from Bag
				</button>
			</div>
		</div>
	);
}
