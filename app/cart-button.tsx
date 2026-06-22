"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2.5 rounded-full text-brand-ink hover:bg-brand-cream transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-brand-coral text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
