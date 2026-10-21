"use client";

import Link from "next/link";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type Cart, type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
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

	// Solace cart line: an 80×90 photograph, then name, unit price and the quantity stepper.
	return (
		<div className="flex">
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-[5.625rem] w-20 shrink-0 overflow-hidden bg-secondary"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="80px" />}
			</Link>

			<div className="flex min-w-0 flex-1 justify-between gap-3 py-1 pl-4">
				<div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
					<div className="flex flex-col gap-1">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="line-clamp-2 text-copy font-medium hover:underline"
						>
							{product.name}
						</Link>
						<span className="text-copy text-muted-foreground">
							{formatMoney({ amount: price, currency, locale })}
						</span>
					</div>
					<div
						className={cn(
							"inline-flex w-max items-center border border-border transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							className="flex size-8 shrink-0 items-center justify-center transition-colors hover:bg-hover"
							aria-label={`Decrease quantity, ${product.name}`}
						>
							<MinusIcon className="size-4" />
						</button>
						<span className="flex h-8 w-8 items-center justify-center text-copy tabular-nums">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex size-8 shrink-0 items-center justify-center transition-colors hover:bg-hover"
							aria-label={`Increase quantity, ${product.name}`}
						>
							<PlusIcon className="size-4" />
						</button>
					</div>
				</div>
				<div className="flex flex-col items-end justify-between gap-2">
					<span className="whitespace-nowrap text-copy font-medium">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</span>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="-mr-1.5 inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-hover disabled:pointer-events-none disabled:opacity-50"
						aria-label={`Remove ${product.name}`}
					>
						<TrashIcon className="size-[1.125rem]" />
					</button>
				</div>
			</div>
		</div>
	);
}
