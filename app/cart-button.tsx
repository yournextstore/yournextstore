"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-secondary transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" />
			{itemCount > 0 ? (
				<span className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-[10px] rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px]">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
