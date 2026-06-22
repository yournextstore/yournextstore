"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex items-center gap-2 text-sm font-semibold text-fizz-sky hover:text-fizz-sky/80 transition-colors px-2 py-1 rounded-full"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" />
			<span className="hidden sm:inline">Cart</span>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="ml-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-fizz-berry text-white text-[0.65rem] font-bold"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
