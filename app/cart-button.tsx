"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f7e4d4] transition-colors"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5 text-[#1a0f4d]" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[#4b1fb5] text-white text-[10px] font-extrabold rounded-full min-w-5 h-5 px-1 flex items-center justify-center ring-2 ring-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
