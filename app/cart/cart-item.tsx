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
		<div
			className={cn("flex items-center border border-border transition-opacity", isPending && "opacity-70")}
		>
			{/* The original's stacked + / − control column on the left edge. */}
			<div className="flex h-[90px] w-[30px] shrink-0 flex-col items-stretch border-r border-border">
				<button
					type="button"
					onClick={handleIncrement}
					className="flex flex-1 items-center justify-center text-foreground hover:bg-secondary"
					aria-label={`Increase quantity of ${product.name}`}
				>
					<Plus aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
				</button>
				<button
					type="button"
					onClick={handleDecrement}
					className="flex flex-1 items-center justify-center border-t border-border text-foreground hover:bg-secondary"
					aria-label={`Decrease quantity of ${product.name}`}
				>
					<Minus aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
				</button>
			</div>
			<div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-x-3 px-3 sm:grid-cols-[90px_minmax(0,1fr)_80px_40px] sm:gap-x-4">
				<Link
					href={`/product/${product.slug}`}
					onClick={closeCart}
					className="relative h-16 w-16 overflow-hidden sm:h-[90px] sm:w-[90px]"
				>
					{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="90px" />}
					<span className="sr-only">{product.name}</span>
				</Link>
				<div className="min-w-0">
					<Link
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="block truncate py-1 text-sal-base font-bold text-foreground underline underline-offset-2"
					>
						{product.name}
					</Link>
					{options && <p className="text-[0.75rem] font-bold text-muted-foreground">{options}</p>}
					{item.subscriptionPlan && (
						<p className="text-[0.75rem] font-bold text-muted-foreground">
							{planLabel(item.subscriptionPlan)}
						</p>
					)}
					<dl className="mt-1 grid grid-cols-2 gap-x-3">
						<div>
							<dt className="mb-1 text-[0.75rem] font-bold text-muted-foreground">Quantity</dt>
							<dd className="text-sal-sm font-bold text-foreground">{quantity}</dd>
						</div>
						<div>
							<dt className="mb-1 text-[0.75rem] font-bold text-muted-foreground">Each</dt>
							<dd className="text-sal-sm font-bold text-foreground">
								{formatMoney({ amount: price, currency, locale })}
							</dd>
						</div>
					</dl>
				</div>
				<div className="flex flex-col items-end gap-3 sm:contents">
					<p className="text-right text-sal-base font-bold text-foreground">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</p>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="sal-btn sal-btn-border h-9 w-9 justify-self-end p-0"
						aria-label={`Remove ${product.name}`}
					>
						<X aria-hidden="true" className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
