"use client";

import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { YnsLink } from "@/components/yns-link";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type CartItemProps = {
	item: CartLineItem;
};

export function CartItem({ item }: CartItemProps) {
	const router = useRouter();
	const { dispatch, closeCart, startMutation } = useCart();
	const [isPending, startTransition] = useTransition();

	const { productVariant, quantity } = item;
	const { product } = productVariant;

	const image = getProductThumbnail(productVariant.images) ?? getProductThumbnail(product.images);
	const price = getLineItemUnitPrice(item);
	const lineTotal = price * BigInt(quantity);

	const targetQuantityRef = useRef<number | null>(null);
	const sendQueueRef = useRef<Promise<void>>(Promise.resolve());

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
					await setCartQuantity(productVariant.id, latest);
				});
				// Drain the queue, then refresh — concurrent transitions land here together,
				// so their refresh calls batch into one re-render.
				let tail: Promise<void>;
				do {
					tail = sendQueueRef.current;
					await tail;
				} while (tail !== sendQueueRef.current);
				router.refresh();
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
		<div className="flex gap-4 py-6">
			{/* Product Image */}
			<YnsLink
				prefetch={"eager"}
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-24 w-20 shrink-0 overflow-hidden bg-zinc-100"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="80px" />}
			</YnsLink>

			{/* Product Details */}
			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<div className="flex items-start justify-between gap-2">
					<YnsLink
						prefetch={"eager"}
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="text-sm font-light text-zinc-900 hover:text-zinc-500 transition-colors line-clamp-2"
					>
						{product.name}
					</YnsLink>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="shrink-0 p-1 text-zinc-400 hover:text-zinc-900 transition-colors disabled:pointer-events-none disabled:opacity-50"
						aria-label="Remove item"
					>
						<X className="h-3 w-3" />
					</button>
				</div>

				<div className="flex items-center justify-between mt-4">
					{/* Quantity Controls */}
					<div
						className={cn(
							"inline-flex items-center border border-zinc-200 transition-opacity",
							isPending && "opacity-50",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							disabled={isPending}
							className="shrink-0 flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors disabled:pointer-events-none"
							aria-label="Decrease quantity"
						>
							<Minus className="h-2.5 w-2.5" />
						</button>
						<span className="flex h-8 w-8 items-center justify-center text-xs text-zinc-900 font-light border-x border-zinc-200">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							disabled={isPending}
							className="shrink-0 flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors disabled:pointer-events-none"
							aria-label="Increase quantity"
						>
							<Plus className="h-2.5 w-2.5" />
						</button>
					</div>

					{/* Price */}
					<span className="text-sm text-zinc-900 font-light">
						{formatMoney({ amount: lineTotal, currency: CURRENCY, locale: LOCALE })}
					</span>
				</div>
			</div>
		</div>
	);
}
