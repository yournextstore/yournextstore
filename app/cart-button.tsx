"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex items-center gap-2 h-10 px-4 rounded-full bg-foreground text-background hover:opacity-90 transition-all text-sm font-medium"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-4 h-4" />
			<span className="hidden sm:inline">Cart</span>
			<span
				aria-live="polite"
				className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-yns-sun text-foreground text-[11px] font-semibold"
			>
				{itemCount}
			</span>
		</button>
	);
}
