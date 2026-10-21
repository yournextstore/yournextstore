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

	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const step =
		"inline-flex size-8 shrink-0 items-center justify-center border border-input bg-transparent shadow-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50";

	return (
		<div className="space-y-3">
			<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
				<div className="flex min-w-0 items-center gap-4">
					<div className="relative size-16 shrink-0 overflow-hidden rounded bg-secondary">
						{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="64px" />}
					</div>
					<div className="flex min-w-0 flex-col space-y-1 self-start">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="line-clamp-2 text-sm font-medium hover:underline"
						>
							{product.name}
						</Link>
						{options && <span className="line-clamp-1 text-xs text-muted-foreground">{options}</span>}
						{item.subscriptionPlan && (
							<span className="line-clamp-1 text-xs text-muted-foreground">
								{planLabel(item.subscriptionPlan)}
							</span>
						)}
						<span className="line-clamp-1 text-xs text-muted-foreground">
							{fmt(price)} × {quantity} = {fmt(lineTotal)}
						</span>
					</div>
				</div>
				<div className={cn("flex shrink-0 items-center gap-2 transition-opacity", isPending && "opacity-70")}>
					<div className="flex items-center">
						<button
							type="button"
							onClick={handleDecrement}
							className={`${step} rounded-l-md`}
							aria-label={`Decrease quantity of ${product.name}`}
						>
							<Minus aria-hidden="true" className="size-3" />
						</button>
						<span className="flex h-8 w-10 items-center justify-center border-y border-input text-xs tabular-nums shadow-sm">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className={`${step} rounded-r-md`}
							aria-label={`Increase quantity of ${product.name}`}
						>
							<Plus aria-hidden="true" className="size-3" />
						</button>
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className={`${step} rounded-md`}
						aria-label={`Remove ${product.name}`}
					>
						<Trash2 aria-hidden="true" className="size-3" />
					</button>
				</div>
			</div>
			<div className="h-px w-full bg-border" />
		</div>
	);
}
