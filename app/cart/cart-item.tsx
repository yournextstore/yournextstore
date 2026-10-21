"use client";

import { Minus, Plus } from "lucide-react";
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
		<div className="flex gap-4 py-4">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-[8.5rem] w-[6.75rem] shrink-0 overflow-hidden rounded-md bg-stage"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="108px" />}
			</Link>

			<div className="flex min-w-0 flex-1 flex-col">
				<Link
					href={`/product/${product.slug}`}
					onClick={closeCart}
					className="line-clamp-2 text-[15px] leading-snug font-medium tracking-[0.01em] uppercase hover:underline"
				>
					{product.name}
				</Link>

				<div className="mt-auto flex items-center justify-between gap-2 pt-4">
					<div
						className={cn(
							"inline-flex h-10 items-center rounded-xs bg-muted transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							className="flex h-full w-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
							aria-label="Decrease quantity"
						>
							<Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
						</button>
						<span className="flex h-full w-8 items-center justify-center text-sm tabular-nums">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex h-full w-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
							aria-label="Increase quantity"
						>
							<Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
						</button>
					</div>
					<span className="text-[15px] font-medium tabular-nums">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</span>
				</div>
				<button
					type="button"
					onClick={handleRemove}
					disabled={isPending}
					className="mt-2 w-fit text-xs uppercase underline underline-offset-4 hover:no-underline disabled:pointer-events-none disabled:opacity-50"
				>
					Remove<span className="sr-only"> {product.name}</span>
				</button>
			</div>
		</div>
	);
}
