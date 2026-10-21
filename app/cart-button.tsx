"use client";

import { useCart } from "@/app/cart/cart-context";
import { CartIcon } from "@/components/icons";

/** The original's bag icon with its item count set small at the top right. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center transition-opacity hover:opacity-70"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<CartIcon className="size-8" />
			<span aria-hidden="true" className="absolute top-0.5 right-0 text-tiny font-semibold tabular-nums">
				{itemCount}
			</span>
		</button>
	);
}
