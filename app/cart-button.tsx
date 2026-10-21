"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="icon-button cart-button"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingBag size={20} strokeWidth={1.75} aria-hidden />
			<span className="count" aria-hidden>
				{itemCount}
			</span>
		</button>
	);
}
