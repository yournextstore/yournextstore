"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
<<<<<<< HEAD:app/cart/cart-item.tsx
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { removeFromCart, setCartQuantity } from "@/app/cart/actions";
import { type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { YnsLink } from "@/components/yns-link";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
=======
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { formatMoney } from "../../money";
import { removeFromCart, setCartQuantity } from "./actions";
import { type CartLineItem, useCart } from "./cart-context";
import { useRouter } from "next/navigation";

const currency = "USD";
const locale = "en-US";
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/cart-item.tsx

type CartItemProps = {
	item: CartLineItem;
};

export function CartItem({ item }: CartItemProps) {
	const router = useRouter();
	const { dispatch, closeCart } = useCart();
<<<<<<< HEAD:app/cart/cart-item.tsx
	const [isPending, startTransition] = useTransition();
=======
	const [, startTransition] = useTransition();
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/cart-item.tsx

	const { productVariant, quantity } = item;
	const { product } = productVariant;

<<<<<<< HEAD:app/cart/cart-item.tsx
	const image = getProductThumbnail(productVariant.images) ?? getProductThumbnail(product.images);
	const price = getLineItemUnitPrice(item);
=======
	const image = productVariant.images[0] ?? product.images[0];
	const price = BigInt(productVariant.price);
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/cart-item.tsx
	const lineTotal = price * BigInt(quantity);

	const handleRemove = () => {
		startTransition(async () => {
			dispatch({ type: "REMOVE", variantId: productVariant.id });
			await removeFromCart(productVariant.id);
			router.refresh();
		});
	};

	const handleIncrement = () => {
		startTransition(async () => {
			dispatch({ type: "INCREASE", variantId: productVariant.id });
			await setCartQuantity(productVariant.id, quantity + 1);
			router.refresh();
		});
	};

	const handleDecrement = () => {
		if (quantity <= 1) {
			handleRemove();
			return;
		}
		startTransition(async () => {
			dispatch({ type: "DECREASE", variantId: productVariant.id });
			await setCartQuantity(productVariant.id, quantity - 1);
			router.refresh();
		});
	};

	return (
		<div className="flex gap-3 py-4">
			{/* Product Image */}
<<<<<<< HEAD:app/cart/cart-item.tsx
			<YnsLink
				prefetch={"eager"}
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="96px" />}
			</YnsLink>
=======
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary"
			>
				{image && <Image src={image} alt={product.name} fill className="object-cover" sizes="96px" />}
			</Link>
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/cart-item.tsx

			{/* Product Details */}
			<div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
				<div className="flex items-start justify-between gap-2">
<<<<<<< HEAD:app/cart/cart-item.tsx
					<YnsLink
						prefetch={"eager"}
=======
					<Link
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/cart-item.tsx
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="text-sm font-medium leading-tight text-foreground hover:underline line-clamp-2"
					>
						{product.name}
<<<<<<< HEAD:app/cart/cart-item.tsx
					</YnsLink>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors disabled:pointer-events-none disabled:opacity-50"
						aria-label="Remove item"
=======
					</Link>
					<button
						type="button"
						onClick={handleRemove}
						className="flex-shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/cart-item.tsx
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>

				<div className="flex items-center justify-between">
					{/* Quantity Controls */}
<<<<<<< HEAD:app/cart/cart-item.tsx
					<div
						className={cn(
							"inline-flex items-center rounded-full border border-border transition-opacity",
							isPending && "opacity-50",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							disabled={isPending}
							className="shrink-0 flex h-7 w-7 items-center justify-center rounded-l-full hover:bg-secondary transition-colors disabled:pointer-events-none"
							aria-label="Decrease quantity"
=======
					<div className="inline-flex items-center rounded-full border border-border">
						<button
							type="button"
							onClick={handleDecrement}
							className="flex h-7 w-7 items-center justify-center rounded-l-full hover:bg-secondary transition-colors"
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/cart-item.tsx
						>
							<Minus className="h-3 w-3" />
						</button>
						<span className="flex h-7 w-8 items-center justify-center text-sm tabular-nums">{quantity}</span>
						<button
							type="button"
							onClick={handleIncrement}
<<<<<<< HEAD:app/cart/cart-item.tsx
							disabled={isPending}
							className="shrink-0 flex h-7 w-7 items-center justify-center rounded-r-full hover:bg-secondary transition-colors disabled:pointer-events-none"
							aria-label="Increase quantity"
=======
							className="flex h-7 w-7 items-center justify-center rounded-r-full hover:bg-secondary transition-colors"
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/cart-item.tsx
						>
							<Plus className="h-3 w-3" />
						</button>
					</div>

					{/* Price */}
					<span className="text-sm font-semibold">
<<<<<<< HEAD:app/cart/cart-item.tsx
						{formatMoney({ amount: lineTotal, currency: CURRENCY, locale: LOCALE })}
=======
						{formatMoney({ amount: lineTotal, currency, locale })}
>>>>>>> 74ad60e (feat: optimistic update):src/app/cart/cart-item.tsx
					</span>
				</div>
			</div>
		</div>
	);
}
