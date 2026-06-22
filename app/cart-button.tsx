"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-yns-cream-soft rounded-full transition-colors relative text-yns-cocoa"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-yns-green text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
