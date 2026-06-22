"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-white/15 rounded-full transition-colors relative text-white"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[var(--cream)] text-[var(--maroon)] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
