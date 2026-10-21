"use client";

import { Minus, Plus, X } from "lucide-react";
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
		<li className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700">
			<div className="relative flex w-full flex-row justify-between px-1 py-4">
				<div className="absolute z-40 -mt-2 -ml-1">
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						aria-label={`Remove ${product.name} from cart`}
						className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-500 disabled:opacity-50"
					>
						<X className="mx-px h-4 w-4 text-white dark:text-black" aria-hidden="true" />
					</button>
				</div>
				<div className="flex min-w-0 flex-row">
					<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900">
						{image ? <YNSMedia src={image} alt="" fill className="object-cover" sizes="64px" /> : null}
					</div>
					<Link
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="z-30 ml-2 flex min-w-0 flex-row space-x-4"
					>
						<span className="flex flex-1 flex-col text-base leading-tight">{product.name}</span>
					</Link>
				</div>
				<div className="flex h-16 shrink-0 flex-col justify-between pl-2">
					<p className="flex justify-end text-right text-sm">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</p>
					<div
						className={cn(
							"ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 transition-opacity dark:border-neutral-700",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							aria-label="Reduce item quantity"
							className="ml-auto flex h-full max-w-9 min-w-9 flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:opacity-80"
						>
							<Minus className="h-4 w-4 dark:text-neutral-500" aria-hidden="true" />
						</button>
						<p className="w-6 text-center">
							<span className="w-full text-sm tabular-nums">{quantity}</span>
						</p>
						<button
							type="button"
							onClick={handleIncrement}
							aria-label="Increase item quantity"
							className="flex h-full max-w-9 min-w-9 flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:opacity-80"
						>
							<Plus className="h-4 w-4 dark:text-neutral-500" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</li>
	);
}
