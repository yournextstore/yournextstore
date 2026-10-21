"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<ShoppingCart aria-hidden className="h-5 w-5 fill-foreground" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span aria-hidden className="absolute top-2 right-1 h-3 w-3 rounded-full bg-sky-dot" />
			) : null}
		</button>
	);
}
