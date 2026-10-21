"use client";

import { Minus, Plus, XIcon } from "lucide-react";
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
		<div className="flex gap-[15px] py-[15px]">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				tabIndex={-1}
				aria-hidden
				className="relative size-[60px] shrink-0"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-contain" sizes="60px" />}
			</Link>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-[10px]">
					<div className="min-w-0">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="line-clamp-3 text-uk-sm leading-6 text-foreground hover:text-primary"
						>
							{product.name}
						</Link>
						{options && <p className="text-uk-xs text-muted-foreground">{options}</p>}
						{item.subscriptionPlan && (
							<p className="text-uk-xs text-muted-foreground">{planLabel(item.subscriptionPlan)}</p>
						)}
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="-mt-[5px] -mr-[5px] flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
						aria-label={`Remove ${product.name}`}
					>
						<XIcon aria-hidden className="size-4" strokeWidth={1.25} />
					</button>
				</div>
				<div className="mt-[5px] flex flex-wrap items-center justify-between gap-[10px]">
					<p className="text-uk-sm">
						<span className="font-medium text-foreground">
							{formatMoney({ amount: lineTotal, currency, locale })}
						</span>
						<span className="ml-[10px] text-uk-xs text-muted-foreground">
							{quantity} × {formatMoney({ amount: price, currency, locale })}
						</span>
					</p>
					<div className={cn("flex items-center transition-opacity", isPending && "opacity-70")}>
						<button
							type="button"
							onClick={handleDecrement}
							className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground"
							aria-label={`Decrease quantity of ${product.name}`}
						>
							<Minus aria-hidden className="size-3" strokeWidth={1.5} />
						</button>
						<span className="flex h-6 min-w-8 items-center justify-center rounded-[4px] border border-border px-1 text-uk-xs tabular-nums text-foreground">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground"
							aria-label={`Increase quantity of ${product.name}`}
						>
							<Plus aria-hidden className="size-3" strokeWidth={1.5} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
