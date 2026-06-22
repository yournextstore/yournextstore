"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex items-center gap-2 px-2 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors group"
			aria-label="Shopping cart"
		>
			<span className="hidden sm:inline">Cart</span>
			<span className="relative inline-flex items-center justify-center">
				<ShoppingBag className="w-5 h-5 sm:w-4 sm:h-4 transition-transform group-hover:-rotate-6" />
				{itemCount > 0 ? (
					<span
						aria-live="polite"
						className="absolute -top-2 -right-2 sm:-top-1.5 sm:-right-2.5 bg-terracotta text-cream text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-sm"
					>
						{itemCount}
					</span>
				) : null}
			</span>
		</button>
	);
}
