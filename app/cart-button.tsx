"use client";

import { useCart } from "@/app/cart/cart-context";

/** The original's header reads "card (0)": a plain word with the count in brackets. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="whitespace-nowrap underline-offset-[0.3em] hover:underline"
			data-cart-button
		>
			Cart (<span aria-live="polite">{itemCount}</span>)<span className="sr-only"> items, open cart</span>
		</button>
	);
}
