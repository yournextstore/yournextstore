"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" />
			<span className="hidden sm:inline text-sm font-medium">Cart</span>
			{itemCount > 0 ? (
				<span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
