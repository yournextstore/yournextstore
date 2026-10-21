"use client";

import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type Cart, type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button } from "@/components/ui/button";
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

	// The original's cart card: photo on the left, name, price and the − / count / + stepper.
	return (
		<div className="grid grid-cols-6 gap-4 rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				tabIndex={-1}
				aria-hidden
				className="relative col-span-2 aspect-square overflow-hidden rounded-lg bg-muted"
			>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="120px" />}
			</Link>
			<div className="col-span-4 flex min-w-0 flex-col justify-between gap-2">
				<div className="space-y-1">
					<Link
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="line-clamp-2 text-sm hover:underline"
					>
						{product.name}
					</Link>
					<p className="text-base">{formatMoney({ amount: lineTotal, currency, locale })}</p>
					{quantity > 1 && (
						<p className="text-xs text-muted-foreground">
							{formatMoney({ amount: price, currency, locale })} each
						</p>
					)}
				</div>
				<div className={cn("flex items-center gap-1 transition-opacity", isPending && "opacity-70")}>
					<Button
						type="button"
						variant="outline"
						size="icon-sm"
						onClick={handleDecrement}
						aria-label={quantity === 1 ? `Remove ${product.name}` : "Decrease quantity"}
					>
						{quantity === 1 ? (
							<XIcon className="h-4" aria-hidden />
						) : (
							<MinusIcon className="h-4" aria-hidden />
						)}
					</Button>
					<span className="inline-flex h-8 w-8 items-center justify-center text-sm tabular-nums">
						{quantity}
					</span>
					<Button
						type="button"
						variant="outline"
						size="icon-sm"
						onClick={handleIncrement}
						aria-label="Increase quantity"
					>
						<PlusIcon className="h-4" aria-hidden />
					</Button>
				</div>
			</div>
		</div>
	);
}
