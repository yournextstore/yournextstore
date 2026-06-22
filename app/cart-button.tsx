"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="h-10 w-10 flex items-center justify-center border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-4 h-4" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-2 -right-2 bg-[#d4ff3a] border-2 border-foreground text-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
