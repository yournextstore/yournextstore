"use client";

import { useCart } from "@/app/cart/cart-context";

/** The original's outlined "The counter" button, here the basket with its count; highlighter on hover. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="nav-cta"
			aria-label={`Basket ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			Basket{" "}
			<span className="mono min-w-[1.4em] rounded-full bg-ink px-1.5 text-center text-[0.68rem] leading-[1.6] text-kraft tabular-nums">
				{itemCount}
			</span>
		</button>
	);
}
