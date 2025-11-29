"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { formatMoney } from "../../src/money";
import { removeFromCart, setCartQuantity } from "./actions";
import { type CartLineItem, useCart } from "./cart-context";

const currency = "USD";
const locale = "en-US";

type CartItemProps = {
	item: CartLineItem;
};

export function CartItem({ item }: CartItemProps) {
	const router = useRouter();
	const { dispatch, closeCart } = useCart();
	const [, startTransition] = useTransition();

	const { productVariant, quantity } = item;
	const { product } = productVariant;

	const image = productVariant.images[0] ?? product.images[0];
	const price = BigInt(productVariant.price);
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
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary"
			>
				{image && <Image src={image} alt={product.name} fill className="object-cover" sizes="96px" />}
			</Link>

			{/* Product Details */}
			<div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
				<div className="flex items-start justify-between gap-2">
					<Link
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="text-sm font-medium leading-tight text-foreground hover:underline line-clamp-2"
					>
						{product.name}
					</Link>
					<button
						type="button"
						onClick={handleRemove}
						className="flex-shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>

				<div className="flex items-center justify-between">
					{/* Quantity Controls */}
					<div className="inline-flex items-center rounded-full border border-border">
						<button
							type="button"
							onClick={handleDecrement}
							className="flex h-7 w-7 items-center justify-center rounded-l-full hover:bg-secondary transition-colors"
						>
							<Minus className="h-3 w-3" />
						</button>
						<span className="flex h-7 w-8 items-center justify-center text-sm tabular-nums">{quantity}</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="flex h-7 w-7 items-center justify-center rounded-r-full hover:bg-secondary transition-colors"
						>
							<Plus className="h-3 w-3" />
						</button>
					</div>

					{/* Price */}
					<span className="text-sm font-semibold">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</span>
				</div>
			</div>
		</div>
	);
}
