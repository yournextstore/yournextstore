"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-[var(--color-blush-soft)] transition-colors"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[var(--color-peach)] text-[var(--color-ink)] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-background"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
