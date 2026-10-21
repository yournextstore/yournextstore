"use client";

import { useCart } from "@/app/cart/cart-context";

/** The original's outlined "Reserve" pill becomes the cart: it fills lime on hover. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="hs-nav-cta"
			aria-label={`Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			Cart{" "}
			<span
				aria-live="polite"
				className="hs-mono grid h-5 min-w-5 place-items-center rounded-md bg-foreground px-1 text-[0.7rem] leading-none text-background"
			>
				{itemCount}
			</span>
		</button>
	);
}
