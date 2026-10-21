"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex min-h-6 items-center whitespace-nowrap hover:italic"
		>
			Shopping Bag ({itemCount})
		</button>
	);
}
