"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="px-3 py-2 text-[11px] tracking-utility font-bold uppercase text-[color:var(--color-yns-ink)] hover:text-[color:var(--color-yns-wood)] transition-colors"
			aria-label={`Shopping cart with ${itemCount} items`}
		>
			Cart ({itemCount})
		</button>
	);
}
