"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="text-[0.78rem] tracking-[0.18em] uppercase font-medium text-foreground hover:text-[color:var(--color-terracotta-deep)] transition-colors"
			aria-label="Shopping cart"
		>
			Bag ({itemCount})
		</button>
	);
}
