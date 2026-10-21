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
		<div className="space-y-3">
			<div className="flex flex-col items-start justify-between gap-4 xs:flex-row">
				<div className="flex min-w-0 items-center gap-4">
					<Link
						href={`/product/${product.slug}`}
						onClick={closeCart}
						tabIndex={-1}
						aria-hidden="true"
						className="relative aspect-square size-16 shrink-0 overflow-hidden rounded bg-secondary"
					>
						{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="64px" />}
					</Link>
					<div className="flex min-w-0 flex-col gap-1 self-start">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="line-clamp-1 text-sm font-medium hover:underline"
						>
							{product.name}
						</Link>
						<span className="line-clamp-1 text-xs text-muted-foreground">
							{formatMoney({ amount: price, currency, locale })} x {quantity} ={" "}
							{formatMoney({ amount: lineTotal, currency, locale })}
						</span>
						{options && <span className="line-clamp-1 text-xs text-muted-foreground">{options}</span>}
						{item.subscriptionPlan && (
							<span className="line-clamp-1 text-xs text-muted-foreground">
								{planLabel(item.subscriptionPlan)}
							</span>
						)}
					</div>
				</div>
				<div className={cn("flex shrink-0 items-center gap-2", isPending && "opacity-70")}>
					<div className="flex items-center">
						<button
							type="button"
							onClick={handleDecrement}
							className="inline-flex size-8 items-center justify-center rounded-l-md border border-input bg-background shadow-xs transition-colors hover:bg-accent"
							aria-label="Remove one item"
						>
							<Minus className="size-3" aria-hidden="true" />
						</button>
						<span className="flex h-8 w-14 items-center border-y border-input px-3 text-sm tabular-nums">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="inline-flex size-8 items-center justify-center rounded-r-md border border-input bg-background shadow-xs transition-colors hover:bg-accent"
							aria-label="Add one item"
						>
							<Plus className="size-3" aria-hidden="true" />
						</button>
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="inline-flex size-8 items-center justify-center rounded-md border border-input bg-background shadow-xs transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
						aria-label={`Delete ${product.name}`}
					>
						<Trash2 className="size-3" aria-hidden="true" />
					</button>
				</div>
			</div>
			<div className="h-px bg-border" />
		</div>
	);
}
