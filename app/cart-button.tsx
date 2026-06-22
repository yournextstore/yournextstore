"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 text-white/85 hover:text-white hover:bg-white/10 rounded-full transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[var(--lime)] text-[var(--forest-deep)] text-[10px] font-semibold rounded-full w-[18px] h-[18px] flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
