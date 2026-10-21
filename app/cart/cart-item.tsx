"use client";

import { Minus, Plus } from "lucide-react";
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
	const plan = item.subscriptionPlan ? planLabel(item.subscriptionPlan) : null;

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

	// A tile in a cart bucket: the photograph at the bucket's height, a white quantity chip
	// bottom-left and the black remove square bottom-right, as in the original. The option
	// and plan chips top-left tell two lines of one product apart.
	return (
		<li
			className={cn(
				"relative aspect-[2/3] h-full min-w-[104px] shrink-0 bg-swag-paper",
				isPending && "opacity-60",
			)}
		>
			<Link href={`/product/${product.slug}`} onClick={closeCart} className="absolute inset-0">
				<span className="sr-only">
					{product.name}
					{options && `, ${options}`}
					{plan && `, ${plan}`}, {formatMoney({ amount: lineTotal, currency, locale })}
				</span>
				{image && <YNSMedia src={image} alt="" fill className="object-cover" sizes="140px" />}
			</Link>
			{(options || plan) && (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute top-0 left-0 z-10 flex max-w-[calc(100%-30px)] flex-col items-start"
				>
					{options && (
						<span className="max-w-full truncate bg-white px-1 text-t14 text-black">{options}</span>
					)}
					{plan && <span className="max-w-full truncate bg-black px-1 text-t14 text-white">{plan}</span>}
				</div>
			)}
			<div className="absolute bottom-1.5 left-1.5 z-10 flex items-stretch bg-white text-t14 text-black">
				<button
					type="button"
					onClick={handleDecrement}
					className="flex h-6 w-6 items-center justify-center hover:bg-swag-red hover:text-white"
					aria-label={`Decrease quantity of ${product.name}`}
				>
					<Minus className="h-3 w-3" aria-hidden />
				</button>
				<span className="flex h-6 min-w-5 items-center justify-center tabular-nums">{quantity}</span>
				<button
					type="button"
					onClick={handleIncrement}
					className="flex h-6 w-6 items-center justify-center hover:bg-swag-red hover:text-white"
					aria-label={`Increase quantity of ${product.name}`}
				>
					<Plus className="h-3 w-3" aria-hidden />
				</button>
			</div>
			<button
				type="button"
				onClick={handleRemove}
				disabled={isPending}
				className="absolute top-0 right-0 z-10 flex h-[30px] w-[30px] items-center justify-center bg-black text-t14 text-white hover:bg-swag-red disabled:pointer-events-none"
				aria-label={`Remove ${product.name}`}
			>
				x
			</button>
		</li>
	);
}
