"use client";

import { Minus, Plus, X } from "lucide-react";
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
		<div className="flex gap-5 border-b border-border py-5 last:border-b-0">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-40 w-[7.5rem] shrink-0 overflow-hidden rounded-lg bg-secondary"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="120px" />}
			</Link>

			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 space-y-1.5">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="line-clamp-3 text-base leading-snug font-medium text-foreground hover:underline sm:text-lg/snug"
						>
							{product.name}
						</Link>
						{options && <p className="text-sm text-muted-foreground">{options}</p>}
						{item.subscriptionPlan && (
							<p className="text-sm text-muted-foreground">{planLabel(item.subscriptionPlan)}</p>
						)}
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="-mt-1 -mr-1 shrink-0 p-1 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
						aria-label="Remove item"
					>
						<X className="h-5 w-5" strokeWidth={1.5} />
					</button>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2">
					<div
						className={cn(
							"inline-flex h-11 items-center rounded-md border border-border bg-card transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							className="flex h-full w-10 shrink-0 items-center justify-center rounded-l-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
							aria-label="Decrease quantity"
						>
							<Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
						</button>
						<span className="flex h-full w-8 items-center justify-center text-base tabular-nums">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex h-full w-10 shrink-0 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
							aria-label="Increase quantity"
						>
							<Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
						</button>
					</div>
					<span className="text-lg tabular-nums sm:text-xl">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</span>
				</div>
			</div>
		</div>
	);
}
