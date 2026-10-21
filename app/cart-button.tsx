"use client";

import { useCart } from "@/app/cart/cart-context";

/** "Cart (n)" in the header: set in italics while the cart is open, as in the original. */
export function CartButton() {
	const { itemCount, isOpen, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			aria-haspopup="dialog"
			aria-expanded={isOpen}
			className="tap whitespace-nowrap aria-expanded:italic"
		>
			Cart (<span aria-live="polite">{itemCount}</span>)
		</button>
	);
}
