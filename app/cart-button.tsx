"use client";

import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex items-center gap-2 rounded-full bg-[var(--accent-saffron)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] transition hover:brightness-95"
			aria-label="Shopping cart"
		>
			<ShoppingBasket className="h-4 w-4" />
			<span className="hidden sm:inline">Cart</span>
			<span
				aria-live="polite"
				className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand-deep)] px-1.5 text-[11px] font-bold text-white"
			>
				{itemCount}
			</span>
		</button>
	);
}
