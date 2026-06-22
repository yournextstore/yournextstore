"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-[var(--pink)]/10 rounded-full transition-colors relative text-[var(--burgundy)]"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-6 h-6" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-[var(--pink)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
