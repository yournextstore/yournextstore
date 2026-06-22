"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest hover:text-cream transition-colors"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-tomato text-cream text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-[var(--cream)]"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
