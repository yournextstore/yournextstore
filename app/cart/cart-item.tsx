"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { removeFromCart, setCartQuantity } from "@/app/cart/actions";
import { type CartLineItem, useCart } from "@/app/cart/cart-context";
import { YnsLink } from "@/components/yns-link";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

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
		<div className="flex gap-4 py-6">
			{/* Product Image */}
			<YnsLink
				prefetch={"eager"}
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-24 w-20 shrink-0 overflow-hidden bg-zinc-100"
			>
				{image && <Image src={image} alt={product.name} fill className="object-cover" sizes="80px" />}
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
						className="shrink-0 p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
					>
						<X className="h-3 w-3" />
					</button>
				</div>

				<div className="flex items-center justify-between mt-4">
					{/* Quantity Controls */}
					<div className="inline-flex items-center border border-zinc-200">
						<button
							type="button"
							onClick={handleDecrement}
							className="shrink-0 flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
						>
							<Minus className="h-2.5 w-2.5" />
						</button>
						<span className="flex h-8 w-8 items-center justify-center text-xs text-zinc-900 font-light border-x border-zinc-200">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="shrink-0 flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
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
