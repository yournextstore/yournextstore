"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 hover:border-ink bg-cream px-4 py-2 transition-colors"
			aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingCart className="w-5 h-5 text-ink" />
			<span className="text-sm font-bold text-ink tabular-nums">{itemCount}</span>
		</button>
	);
}
