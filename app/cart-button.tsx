"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

/** The original's bag icon with its count disc in the top-right corner (always shown, 0 included). */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingBagIcon aria-hidden="true" className="size-6" strokeWidth={1.5} />
			<span
				aria-hidden="true"
				className="absolute top-0 right-0 flex size-5 items-center justify-center rounded-full bg-foreground text-b-sm leading-none text-paper tabular-nums"
			>
				{itemCount}
			</span>
		</button>
	);
}
