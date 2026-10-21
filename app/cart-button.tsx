"use client";

import { useCart } from "@/app/cart/cart-context";

/** The original's cart toggle: an outlined circle holding the item count. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="flex aspect-square w-[2.375rem] items-center justify-center rounded-full border border-offblack text-ui-sm font-bold duration-200 hover:border-offblack/50"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<span aria-live="polite">{itemCount}</span>
		</button>
	);
}
