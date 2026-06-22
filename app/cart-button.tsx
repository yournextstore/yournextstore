"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-4 h-4" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-[var(--color-yns-yellow)] text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
