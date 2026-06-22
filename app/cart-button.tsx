"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex items-center justify-center h-10 w-10 rounded-full text-[#3a4a8c] hover:bg-[#fff8e7] transition-colors"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[#e8456a] text-[#fcefa8] text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-[#fcefa8]"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
