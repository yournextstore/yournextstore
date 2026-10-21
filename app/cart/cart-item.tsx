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

	const options =
		"combinations" in productVariant && Array.isArray(productVariant.combinations)
			? productVariant.combinations.map((c) => c.variantValue.value).join(", ")
			: null;

	return (
		<li className="relative flex w-full justify-between gap-3 px-1 py-4">
			<button
				type="button"
				onClick={handleRemove}
				disabled={isPending}
				aria-label={`Remove ${product.name}`}
				className="absolute start-[52px] top-2 z-10 flex size-6 items-center justify-center rounded-full disabled:opacity-50"
			>
				<span className="flex size-[17px] items-center justify-center rounded-full bg-neutral-500 text-white dark:text-black">
					<X className="size-3.5" aria-hidden="true" />
				</span>
			</button>

			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="flex min-w-0 flex-1 gap-3 hover:[&_.name]:underline"
			>
				<span className="relative h-24 w-18 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
					{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="72px" />}
				</span>
				<span className="flex min-w-0 flex-1 flex-col text-sm sm:text-base">
					<span className="name line-clamp-2 leading-tight break-words">{product.name}</span>
					{options ? <span className="mt-1 text-sm text-muted-foreground capitalize">{options}</span> : null}
				</span>
			</Link>

			<div className="flex min-h-24 shrink-0 flex-col items-end justify-between gap-2">
				<span className="text-sm font-semibold">{formatMoney({ amount: lineTotal, currency, locale })}</span>
				<div
					className={cn(
						"flex h-9 items-center rounded-lg border border-border transition-opacity",
						isPending && "opacity-70",
					)}
				>
					<button
						type="button"
						onClick={handleDecrement}
						className="flex h-full w-9 items-center justify-center rounded-s-lg text-neutral-600 transition hover:text-blue-500 dark:text-neutral-400"
						aria-label={`Decrease quantity of ${product.name}`}
					>
						<Minus className="size-4" aria-hidden="true" />
					</button>
					<span className="w-6 text-center text-sm tabular-nums">{quantity}</span>
					<button
						type="button"
						onClick={handleIncrement}
						className="flex h-full w-9 items-center justify-center rounded-e-lg text-neutral-600 transition hover:text-blue-500 dark:text-neutral-400"
						aria-label={`Increase quantity of ${product.name}`}
					>
						<Plus className="size-4" aria-hidden="true" />
					</button>
				</div>
			</div>
		</li>
	);
}
