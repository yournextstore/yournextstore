"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type Cart, type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { BookCover } from "@/components/book-cover";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { cn, getProductThumbnail } from "@/lib/utils";

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

	const stepClass =
		"rounded-sm border border-border bg-muted px-3 py-1 leading-none transition-colors hover:bg-rule disabled:opacity-50";

	return (
		<div
			className={cn(
				"grid grid-cols-[auto_1fr_auto] gap-x-3 border-b border-rule py-2 text-sm transition-opacity",
				isPending && "opacity-80",
			)}
		>
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				tabIndex={-1}
				aria-hidden="true"
				className="row-span-3 flex h-28 w-20 items-center justify-center rounded-sm bg-muted p-1.5"
			>
				{image ? <BookCover src={image} alt="" sizes="64px" /> : null}
			</Link>
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="link-dashed line-clamp-2 font-medium italic"
			>
				{product.name}
			</Link>
			<button
				type="button"
				onClick={handleRemove}
				disabled={isPending}
				className="row-span-1 self-start p-0.5 opacity-75 transition-opacity hover:opacity-100 disabled:pointer-events-none"
				aria-label={`Remove ${product.name}`}
			>
				<X aria-hidden="true" className="h-5 w-5" />
			</button>
			<p className="col-span-2 col-start-2">
				Price:{" "}
				<span className="font-medium tabular-nums">
					{formatMoney({ amount: lineTotal, currency, locale })}
				</span>
			</p>
			<div className="col-span-2 col-start-2 flex items-center">
				<button type="button" onClick={handleDecrement} className={stepClass} aria-label="Decrease quantity">
					-
				</button>
				<span className="mx-2 inline-block w-5 text-center tabular-nums">{quantity}</span>
				<button type="button" onClick={handleIncrement} className={stepClass} aria-label="Increase quantity">
					+
				</button>
			</div>
		</div>
	);
}
