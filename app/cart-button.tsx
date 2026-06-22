"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-yns-pink-soft/60 transition-colors"
			aria-label="Shopping cart"
		>
			<span className="text-[11px] tracking-[0.18em] uppercase font-medium text-yns-ink">Cart</span>
			<span
				aria-live="polite"
				className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-yns-ink text-yns-cream text-[10px] font-semibold tabular-nums"
			>
				{itemCount}
			</span>
		</button>
	);
}
