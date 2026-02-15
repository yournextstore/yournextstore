"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative p-2 hover:bg-secondary rounded-full transition-colors border-2 border-transparent hover:border-foreground"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-6 h-6" />
			{itemCount > 0 ? (
				<span className="absolute -top-1 -right-1 bg-[#ff2524] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-black">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
