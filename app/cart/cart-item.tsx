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

	const step =
		"flex size-6 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-foreground/20 disabled:opacity-40";

	// The original's .cart-item: photo, name and price on top, counter and Remove below, ruled apart.
	return (
		<div className="relative flex border-border not-last:mb-8 not-last:border-b not-last:pb-8">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				tabIndex={-1}
				aria-hidden
				className="relative aspect-square w-1/4 max-w-40 shrink-0 overflow-hidden bg-muted sm:w-1/3"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="160px" />}
			</Link>

			<div className="flex min-w-0 flex-1 flex-col pl-4">
				<div className="sm:flex sm:items-start">
					<div className="min-w-0 flex-1 sm:pr-12">
						{options && (
							<p className="mb-1 text-micro leading-[1.6] font-semibold tracking-wider uppercase sm:text-nav">
								{options}
							</p>
						)}
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="mb-2 block text-h5 leading-[1.25] sm:mb-4 sm:text-h3"
						>
							{product.name}
						</Link>
						{item.subscriptionPlan && (
							<p className="mb-2 text-micro leading-[1.6] font-semibold sm:text-nav">
								{planLabel(item.subscriptionPlan)}
							</p>
						)}
					</div>
					<p className="font-semibold tabular-nums sm:text-[1.125rem] sm:leading-[1.5]">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</p>
				</div>

				<div className="mt-auto flex items-center justify-between pt-6">
					<div
						className={cn(
							"inline-flex items-center rounded-full border border-border p-1 transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button type="button" onClick={handleDecrement} className={step} aria-label="Decrease quantity">
							<svg
								aria-hidden
								viewBox="0 0 16 16"
								className="size-3"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path d="M2 8h12" />
							</svg>
						</button>
						<span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
						<button type="button" onClick={handleIncrement} className={step} aria-label="Increase quantity">
							<svg
								aria-hidden
								viewBox="0 0 16 16"
								className="size-3"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path d="M2 8h12M8 2v12" />
							</svg>
						</button>
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="cursor-pointer rounded-full px-2 py-1 text-micro font-semibold transition-colors hover:bg-foreground/10 disabled:opacity-50"
						aria-label={`Remove ${product.name}`}
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
}
