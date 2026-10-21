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
		<li
			className={cn(
				"relative flex gap-3 rounded-sm bg-black p-2 transition-opacity",
				isPending && "opacity-70",
			)}
		>
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				tabIndex={-1}
				aria-hidden="true"
				className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-paper lg:size-[100px]"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="100px" />}
			</Link>

			{/* Two columns, as in the original: name and options, then quantity and price. */}
			<div className="grid min-w-0 flex-1 grid-cols-[minmax(0,11rem)_1fr] content-between gap-x-3 gap-y-2 pr-6">
				<div className="flex min-w-0 flex-col gap-0.5">
					<Link
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="leading-[1.2] hover:underline"
					>
						{product.name}
					</Link>
					{options && <span className="font-normal leading-[1.2] text-white/80">{options}</span>}
					{item.subscriptionPlan && (
						<span className="font-normal leading-[1.2] text-white/80">
							{planLabel(item.subscriptionPlan)}
						</span>
					)}
				</div>
				<span className="text-right leading-[1.2] lg:text-left">
					{quantity > 1 ? `${formatMoney({ amount: price, currency, locale })} each` : ""}
				</span>
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={handleDecrement}
						className="flex size-6 items-center justify-center rounded-sm hover:bg-white/15"
						aria-label="Decrease quantity"
					>
						−
					</button>
					<span className="min-w-8 text-center tabular-nums">{quantity} pc</span>
					<button
						type="button"
						onClick={handleIncrement}
						className="flex size-6 items-center justify-center rounded-sm hover:bg-white/15"
						aria-label="Increase quantity"
					>
						+
					</button>
				</div>
				<span className="self-center whitespace-nowrap">
					{formatMoney({ amount: lineTotal, currency, locale })}
				</span>
			</div>
			<button
				type="button"
				onClick={handleRemove}
				disabled={isPending}
				className="absolute top-1 right-1 flex size-6 items-center justify-center disabled:opacity-50"
				aria-label={`Remove ${product.name}`}
			>
				<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
					<path
						d="M11.333 4.667 4.667 11.333m0-6.666 6.666 6.666"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="square"
					/>
				</svg>
			</button>
		</li>
	);
}
