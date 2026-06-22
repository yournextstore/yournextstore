"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-secondary rounded-full transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5 text-espresso" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-terracotta text-cream text-[10px] font-medium rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
