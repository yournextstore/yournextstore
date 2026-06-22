"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f5e8e4]/60 ring-1 ring-black/5 text-[#0f0f0f] hover:bg-[#0f0f0f] hover:text-white transition-colors"
			aria-label="Shopping cart"
		>
			<ShoppingBagIcon className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-[#ff6b35] text-white text-[10px] font-semibold rounded-full min-w-5 h-5 px-1 flex items-center justify-center ring-2 ring-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
