"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground hover:text-[var(--color-leaf-deep)] transition-colors px-2 py-1 rounded-full relative"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-4 h-4" />
			<span className="hidden sm:inline">Cart ({itemCount})</span>
			<span className="sm:hidden">({itemCount})</span>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="sm:hidden absolute -top-1 -right-1 bg-[var(--color-pink)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
