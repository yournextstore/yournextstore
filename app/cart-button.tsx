"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-yns-red-dark rounded-full transition-colors relative text-yns-cream-soft"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-yns-yellow text-yns-brown text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center border-2 border-yns-red"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
