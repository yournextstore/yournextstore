"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="eyebrow text-foreground/85 hover:text-rosewood transition-colors px-1 py-2"
			aria-label="Shopping cart"
		>
			Cart [{itemCount}]
		</button>
	);
}
