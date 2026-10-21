"use client";

import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

/** The original's basket glyph with a coral count bubble on its shoulder. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center text-ink transition-colors hover:text-coral-text"
			aria-label={`Open basket, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingBasket className="size-6" strokeWidth={1.5} />
			<span
				aria-hidden="true"
				className="absolute right-0 top-0.5 flex size-[19px] items-center justify-center rounded-full bg-coral-deep text-[0.62rem] font-bold text-white tabular-nums"
			>
				{itemCount}
			</span>
		</button>
	);
}
