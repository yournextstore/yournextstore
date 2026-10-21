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

	return (
		<li className={cn("flex items-center justify-between gap-6 py-2", isPending && "opacity-80")}>
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative flex h-[115px] w-[90px] shrink-0 items-center overflow-hidden bg-neutral-100"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="100px" />}
				<span className="sr-only">{product.name}</span>
			</Link>
			<div className="flex min-w-0 flex-1 flex-col items-start justify-around gap-0.5 text-[13px]">
				<Link href={`/product/${product.slug}`} onClick={closeCart} className="w-full">
					<span className="line-clamp-2 text-ink hover:underline">{product.name}</span>
				</Link>
				{quantity > 1 && (
					<p className="text-neutral-600">{formatMoney({ amount: price, currency, locale })} each</p>
				)}
				<p className="py-2 font-bold text-ink">{formatMoney({ amount: lineTotal, currency, locale })}</p>
				<div className="flex w-full items-center justify-between">
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						aria-label={`Remove ${product.name}`}
						className="text-neutral-600 underline underline-offset-2 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-50"
					>
						Remove
					</button>
					<div className="flex h-8 w-[100px] items-center justify-between border border-ink px-2 text-sm text-neutral-600">
						<button
							type="button"
							onClick={handleDecrement}
							className="flex size-6 items-center justify-center transition-colors hover:text-ink"
							aria-label="Decrease quantity"
						>
							-
						</button>
						<span className="text-ink tabular-nums">{quantity}</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex size-6 items-center justify-center transition-colors hover:text-ink"
							aria-label="Increase quantity"
						>
							+
						</button>
					</div>
				</div>
			</div>
		</li>
	);
}
