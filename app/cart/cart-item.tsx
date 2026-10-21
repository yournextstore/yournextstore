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

	// A text row like the original's: the name on the left; price, "− 1 +" and Remove on the right.
	return (
		<div className={cn("flex gap-4 py-4 transition-opacity", isPending && "opacity-70")}>
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				tabIndex={-1}
				aria-hidden="true"
				className="relative h-20 w-16 shrink-0 overflow-hidden bg-black"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="64px" />}
			</Link>
			<div className="flex min-w-0 flex-1 flex-col justify-between gap-2 text-copy sm:flex-row sm:items-center">
				<Link
					href={`/product/${product.slug}`}
					onClick={closeCart}
					className="min-w-0 underline-offset-[0.3em] hover:underline"
				>
					{product.name}
				</Link>
				<div className="flex shrink-0 items-center gap-1 text-foot sm:text-copy">
					<span className="mr-2 tabular-nums">{formatMoney({ amount: lineTotal, currency, locale })}</span>
					<button
						type="button"
						onClick={handleDecrement}
						className="flex size-8 items-center justify-center"
						aria-label="Decrease quantity"
					>
						−
					</button>
					<span className="w-6 text-center tabular-nums">{quantity}</span>
					<button
						type="button"
						onClick={handleIncrement}
						className="flex size-8 items-center justify-center"
						aria-label="Increase quantity"
					>
						+
					</button>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="ml-2 min-h-8 underline-offset-[0.3em] hover:underline disabled:opacity-50"
						aria-label={`Remove ${product.name}`}
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
}
