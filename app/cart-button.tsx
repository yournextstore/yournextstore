"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2.5 hover:bg-[var(--olive-deep)]/5 rounded-full transition-colors relative text-[var(--olive-deep)]"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[var(--olive-deep)] text-[var(--cream)] text-[10px] font-medium rounded-full w-5 h-5 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
