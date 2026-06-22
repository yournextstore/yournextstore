"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 rounded-full hover:bg-white/10 transition-colors relative text-[#fbe5ea] hover:text-white"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[#d9a441] text-[#2b2120] text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
