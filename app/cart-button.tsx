"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 hover:bg-primary/5 rounded-lg transition-colors relative group"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
			<span className="hidden sm:inline text-sm text-muted-foreground group-hover:text-primary transition-colors">
				Cart{itemCount > 0 ? ` (${itemCount})` : ""}
			</span>
			{itemCount > 0 ? (
				<span className="sm:hidden absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
