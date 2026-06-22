"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-secondary/40 rounded-full transition-colors relative text-foreground/85 hover:text-foreground"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[#4a76ff] text-white text-[10px] font-medium rounded-full min-w-4 h-4 px-1 flex items-center justify-center ring-2 ring-background"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
