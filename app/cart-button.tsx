"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-soft hover:bg-secondary transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5" />
			{itemCount > 0 ? (
				<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
