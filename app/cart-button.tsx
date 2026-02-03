"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="text-xs tracking-[0.15em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2"
			aria-label="Shopping cart"
		>
			<span>Cart</span>
			{itemCount > 0 ? (
				<span className="text-zinc-900">({itemCount})</span>
			) : null}
		</button>
	);
}
