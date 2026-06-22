"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="group inline-flex items-center gap-2 p-2 hover:opacity-70 transition-opacity"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
			<span aria-live="polite" className="font-eyebrow text-[11px] text-foreground tabular-nums">
				({itemCount})
			</span>
		</button>
	);
}
