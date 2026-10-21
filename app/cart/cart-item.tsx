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
		<div className="flex gap-4 py-4">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary"
				tabIndex={-1}
				aria-hidden="true"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="56px" />}
			</Link>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0 space-y-1">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="line-clamp-2 text-[1.25rem] leading-tight hover:underline"
						>
							{product.name}
						</Link>
						{options && <p className="text-sm text-muted-foreground">{options}</p>}
						{item.subscriptionPlan && (
							<p className="text-sm text-muted-foreground">{planLabel(item.subscriptionPlan)}</p>
						)}
					</div>
					<span className="shrink-0 text-body">{formatMoney({ amount: lineTotal, currency, locale })}</span>
				</div>

				<div className={cn("mt-3 flex items-center gap-2 transition-opacity", isPending && "opacity-70")}>
					<div className="inline-flex h-9 items-center rounded-md border border-foreground">
						<button
							type="button"
							onClick={handleDecrement}
							className="flex size-9 items-center justify-center rounded-l-md transition-colors hover:bg-secondary"
							aria-label="Decrease quantity"
						>
							<Minus className="size-3.5" />
						</button>
						<span className="flex h-9 w-10 items-center justify-center text-body tabular-nums">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex size-9 items-center justify-center rounded-r-md transition-colors hover:bg-secondary"
							aria-label="Increase quantity"
						>
							<Plus className="size-3.5" />
						</button>
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="flex size-9 items-center justify-center rounded-md border border-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
						aria-label={`Remove ${product.name}`}
					>
						<Trash2 className="size-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
