"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex h-6 cursor-pointer items-center whitespace-nowrap hover:underline"
			aria-label={itemCount > 0 ? `Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Cart"}
		>
			Cart{itemCount > 0 ? <span aria-live="polite">&nbsp;{itemCount}</span> : null}
		</button>
	);
}
