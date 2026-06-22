"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2.5 hover:bg-[color:var(--yns-ink)]/5 rounded-full transition-colors relative text-[color:var(--yns-ink)]"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[color:var(--yns-red)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
