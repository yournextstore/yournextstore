"use client";

import Link from "next/link";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type Cart, type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
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
					const res = await setCartQuantity(productVariant.id, latest);
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
		updateQuantity({ type: "REMOVE", variantId: productVariant.id }, 0);
	};

	const handleIncrement = () => {
		updateQuantity({ type: "INCREASE", variantId: productVariant.id }, quantity + 1);
	};

	const handleDecrement = () => {
		if (quantity <= 1) {
			handleRemove();
			return;
		}
		updateQuantity({ type: "DECREASE", variantId: productVariant.id }, quantity - 1);
	};

	// The original's bag line: a big rounded photograph, the name in italic serif, the line
	// total large on the right, and a tiny outlined stepper plus Remove under it.
	return (
		<div className="flex gap-3 border-b border-ink py-3 md:items-end md:gap-4 md:py-4 lg:gap-5 lg:py-5">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white-rock transition-all hover:rounded-none md:h-48 md:w-48 lg:h-56 lg:w-56"
			>
				{image && (
					<YNSMedia src={image} alt="" fill className="object-cover" sizes="(max-width: 768px) 96px, 224px" />
				)}
			</Link>

			<div className="flex min-w-0 flex-grow flex-col md:flex-row md:items-end">
				<div className="min-w-0 md:flex-grow">
					<Link
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="font-serif text-xl leading-none italic hover:underline md:text-2xl lg:text-3xl"
					>
						{product.name}
					</Link>
				</div>
				<div className="flex flex-grow flex-col items-start justify-between gap-2 md:items-end">
					<div className="text-lg tabular-nums md:text-xl lg:text-2xl">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</div>
					<div
						className={cn(
							"flex w-full items-center justify-between gap-3 transition-opacity md:flex-col md:items-end",
							isPending && "opacity-70",
						)}
					>
						<div className="inline-flex items-center md:pb-4 lg:pb-5">
							<span className="pr-2">Quantity:</span>
							<button
								type="button"
								onClick={handleDecrement}
								className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-ink text-xs transition hover:bg-ink hover:text-ecru"
								aria-label={`Decrease quantity of ${product.name}`}
							>
								-
							</button>
							<span className="min-w-8 px-2 text-center tabular-nums md:text-lg">{quantity}</span>
							<button
								type="button"
								onClick={handleIncrement}
								className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-ink text-xs transition hover:bg-ink hover:text-ecru"
								aria-label={`Increase quantity of ${product.name}`}
							>
								+
							</button>
						</div>
						<button
							type="button"
							onClick={handleRemove}
							disabled={isPending}
							className="inline-flex h-6 items-center justify-center rounded-lg border border-ink px-1.5 text-xs opacity-70 transition hover:opacity-100 focus:opacity-100 disabled:pointer-events-none"
						>
							Remove
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
