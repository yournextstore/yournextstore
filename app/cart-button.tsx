"use client";

import { useCart } from "@/app/cart/cart-context";

/** The original's "Pre-order" plate in the header, here the bag with its count. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="btn-premium btn-sm tracking-[0.2em]"
			aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			Cart{" "}
			<span aria-live="polite" className="tabular-nums text-muted-foreground">
				{itemCount}
			</span>
		</button>
	);
}
