"use client";

import Link from "next/link";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type Cart, type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { itemKey, lineOptions, planLabel } from "@/app/cart/cart-math";
import { CloseIcon } from "@/components/njx/icons";
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
		<div className="relative flex gap-4 border-b border-line py-4 last:border-b-0">
			<button
				type="button"
				onClick={handleRemove}
				disabled={isPending}
				className="absolute top-4 right-0 rounded-md p-1.5 text-muted-foreground transition hover:bg-tile hover:text-ink disabled:pointer-events-none disabled:opacity-50"
				aria-label={`Remove ${product.name} from cart`}
			>
				<CloseIcon size={14} />
			</button>
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-tile"
				tabIndex={-1}
				aria-hidden
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="80px" />}
			</Link>

			<div className="min-w-0 flex-1 pr-8">
				<Link
					href={`/product/${product.slug}`}
					onClick={closeCart}
					className="line-clamp-2 text-[15px] font-medium hover:underline hover:underline-offset-4"
				>
					{product.name}
				</Link>
				{options ? <p className="text-[13px] text-muted-foreground">{options}</p> : null}
				{item.subscriptionPlan ? (
					<p className="text-[13px] text-pine-ink">{planLabel(item.subscriptionPlan)}</p>
				) : null}
				<div className="mt-2 flex items-center gap-3">
					<div
						className={cn(
							"flex items-center rounded-md border border-line transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							className="px-2.5 py-1 text-muted-foreground hover:text-ink"
							aria-label="Decrease quantity"
						>
							−
						</button>
						<span className="px-1 text-[14px] tabular-nums">{quantity}</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="px-2.5 py-1 text-muted-foreground hover:text-ink"
							aria-label="Increase quantity"
						>
							+
						</button>
					</div>
					<span className="text-[14px] font-medium">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</span>
				</div>
			</div>
		</div>
	);
}
