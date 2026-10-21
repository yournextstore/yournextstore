"use client";

import Link from "next/link";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type Cart, type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { itemKey, lineOptions, planLabel } from "@/app/cart/cart-math";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
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
		<div className="flex gap-6 border-b border-grayscale-100 py-8 last:border-b-0">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative aspect-[3/4] w-25 shrink-0 overflow-hidden bg-grayscale-50 sm:w-30"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="120px" />}
			</Link>

			<div className="flex min-w-0 flex-grow flex-col justify-between">
				<div>
					<h3 className="text-base font-normal sm:text-title-md">
						<Link href={`/product/${product.slug}`} onClick={closeCart} className="line-clamp-2">
							{product.name}
						</Link>
					</h3>
					{options && <p className="mt-1 text-body-xs text-grayscale-500">{options}</p>}
					{item.subscriptionPlan && (
						<p className="mt-1 text-body-xs text-grayscale-500">{planLabel(item.subscriptionPlan)}</p>
					)}
					<p className="mt-1 text-body-xs sm:hidden">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</p>
				</div>
				<div
					className={cn(
						"mt-4 flex h-8 w-25 items-center justify-between rounded-xs border border-grayscale-200 px-4 transition-opacity",
						isPending && "opacity-70",
					)}
				>
					<button
						type="button"
						onClick={handleDecrement}
						className="inline-flex size-6 shrink-0 items-center justify-center"
						aria-label="Decrease quantity"
					>
						<MinusIcon className="size-4" />
					</button>
					<span className="text-body-xs tabular-nums">{quantity}</span>
					<button
						type="button"
						onClick={handleIncrement}
						className="inline-flex size-6 shrink-0 items-center justify-center"
						aria-label="Increase quantity"
					>
						<PlusIcon className="size-4" />
					</button>
				</div>
			</div>

			<div className="flex flex-col items-end justify-between text-right">
				<span className="max-sm:hidden">{formatMoney({ amount: lineTotal, currency, locale })}</span>
				<button
					type="button"
					onClick={handleRemove}
					disabled={isPending}
					className="-mr-1 inline-flex size-8 items-center justify-center transition-colors hover:text-sale disabled:pointer-events-none disabled:opacity-50"
					aria-label={`Remove ${product.name}`}
				>
					<TrashIcon className="size-6" />
				</button>
			</div>
		</div>
	);
}
