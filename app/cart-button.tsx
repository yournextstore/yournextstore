"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="text-[12px] tracking-[0.22em] uppercase font-light text-foreground/70 hover:text-foreground transition-colors"
			aria-label="Shopping cart"
		>
			Cart ({itemCount})
		</button>
	);
}
