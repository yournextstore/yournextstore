"use client";

import { useCart } from "@/app/cart/cart-context";

/** A caps "Cart" link in the theme's own voice, the count in a small brass badge. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="caps inline-flex h-10 items-center gap-2 px-2 text-[0.875rem] text-ink transition-colors duration-150 hover:text-gold sm:px-3"
			aria-label={`Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}. Open cart`}
		>
			Cart{" "}
			<span className="mono inline-flex h-5 min-w-5 items-center justify-center rounded-[2px] bg-gold px-1 text-[0.75rem] leading-none text-on-gold">
				{itemCount}
			</span>
		</button>
	);
}
