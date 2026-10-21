"use client";

import { useCart } from "@/app/cart/cart-context";

/** The original's outlined "Join the club" pill, carrying the cart instead. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="ml-1 inline-flex h-10 items-center gap-2 rounded-[4px] border border-gold/50 px-3.5 text-[0.88rem] text-cream transition-colors duration-300 hover:border-gold hover:bg-gold/12 sm:px-[18px]"
			aria-label={`Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}. Open cart`}
		>
			Cart <span className="mono min-w-[1ch] text-[0.78rem] text-gold-2 tabular-nums">{itemCount}</span>
		</button>
	);
}
