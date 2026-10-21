"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
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
		<li className="grid grid-cols-12 gap-3 py-8">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative col-span-3 aspect-square overflow-hidden rounded-lg bg-[#e9e2d6] lg:col-span-2"
				tabIndex={-1}
				aria-hidden
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover object-center" sizes="100px" />}
			</Link>

			<div className="col-span-7 flex min-w-0 flex-col gap-2 lg:col-span-8">
				<Link
					href={`/product/${product.slug}`}
					onClick={closeCart}
					className="w-fit text-zinc-900 hover:underline"
				>
					{product.name}
				</Link>
				{options && <p className="text-xs text-zinc-700">{options}</p>}
				{item.subscriptionPlan && <p className="text-xs text-zinc-700">{planLabel(item.subscriptionPlan)}</p>}
				<p className="text-xs text-zinc-700">{formatMoney({ amount: price, currency, locale })}</p>
				<div
					className={cn(
						"mt-1 inline-flex w-fit items-center rounded-lg border border-border transition-opacity",
						isPending && "opacity-60",
					)}
				>
					<button
						type="button"
						onClick={handleDecrement}
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-l-lg text-zinc-600 transition-colors hover:bg-secondary"
						aria-label={`Decrease quantity of ${product.name}`}
					>
						<Minus className="h-3.5 w-3.5" />
					</button>
					<span className="flex h-8 w-8 items-center justify-center text-sm tabular-nums">{quantity}</span>
					<button
						type="button"
						onClick={handleIncrement}
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-r-lg text-zinc-600 transition-colors hover:bg-secondary"
						aria-label={`Increase quantity of ${product.name}`}
					>
						<Plus className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>

			<div className="col-span-2 flex flex-col items-end justify-between">
				<button
					type="button"
					onClick={handleRemove}
					disabled={isPending}
					className="-m-1 p-1 text-zinc-900 transition-colors hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
					aria-label={`Remove ${product.name}`}
				>
					<Trash2 className="h-5 w-5" strokeWidth={1.5} />
				</button>
				<p className="whitespace-nowrap font-medium text-zinc-900">
					{formatMoney({ amount: lineTotal, currency, locale })}
				</p>
			</div>
		</li>
	);
}
