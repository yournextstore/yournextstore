"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
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

	const spinnerButton =
		"flex h-7 w-8 shrink-0 items-center justify-center text-gray-800 transition hover:bg-gray-100";

	return (
		<li className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 border-t border-gray-300 py-3 sm:grid-cols-[64px_minmax(0,1fr)_auto_5.5rem]">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				tabIndex={-1}
				aria-hidden
				className="relative row-span-2 size-16 self-start overflow-hidden rounded-md bg-gray-50 sm:row-span-1 sm:self-center"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="64px" />}
			</Link>

			<div className="min-w-0">
				<Link
					href={`/product/${product.slug}`}
					onClick={closeCart}
					className="line-clamp-2 font-semibold text-gray-800 transition hover:text-green-600"
				>
					{product.name}
				</Link>
				<button
					type="button"
					onClick={handleRemove}
					disabled={isPending}
					className="mt-2 inline-flex items-center gap-1 text-fc-sm leading-none text-gray-500 transition hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
					aria-label={`Remove ${product.name}`}
				>
					<Trash2 className="size-3.5 text-green-600" aria-hidden />
					Remove
				</button>
			</div>

			{/* Below sm the spinner and price share the text column's second row; above, their own columns. */}
			<div className="col-start-2 flex items-center justify-between gap-3 sm:contents">
				<div
					className={cn(
						"inline-flex items-center rounded-lg border border-gray-300 transition-opacity",
						isPending && "opacity-70",
					)}
				>
					<button
						type="button"
						onClick={handleDecrement}
						className={cn(spinnerButton, "rounded-l-lg border-r border-gray-300")}
						aria-label={`Decrease quantity of ${product.name}`}
					>
						<Minus className="size-3" aria-hidden />
					</button>
					<span className="flex h-7 w-9 items-center justify-center text-gray-900 tabular-nums">
						{quantity}
					</span>
					<button
						type="button"
						onClick={handleIncrement}
						className={cn(spinnerButton, "rounded-r-lg border-l border-gray-300")}
						aria-label={`Increase quantity of ${product.name}`}
					>
						<Plus className="size-3" aria-hidden />
					</button>
				</div>
				<span className="text-right font-bold text-gray-800 tabular-nums">
					{formatMoney({ amount: lineTotal, currency, locale })}
				</span>
			</div>
		</li>
	);
}
