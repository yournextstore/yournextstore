"use client";

import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative h-10 w-10 flex items-center justify-center rounded-full bg-forest text-cream hover:bg-lime hover:text-forest-deep transition-colors"
			aria-label="Shopping basket"
		>
			<ShoppingBasket className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-lime text-forest-deep text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center ring-2 ring-forest-deep"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
