"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-white/30 rounded-full transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[#1a1a2e] text-[#fdf6ee] text-[10px] font-semibold rounded-full min-w-5 h-5 px-1 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
