"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.22em] font-medium text-[#2a2622] hover:bg-[#ecd3b8] transition-colors"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-4 h-4" />
			<span className="hidden sm:inline">Cart</span>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-[#d8351f] text-[#f5e4d2] text-[10px] font-medium rounded-full w-5 h-5 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
