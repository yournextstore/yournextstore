"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-[var(--lavender-soft)] rounded-full transition-colors relative text-[var(--cobalt)]"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-[var(--cobalt)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
