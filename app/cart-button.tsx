"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-secondary rounded-sm transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5" />
			{itemCount > 0 ? (
				<span className="absolute -top-0.5 -right-0.5 bg-foreground text-primary-foreground text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
