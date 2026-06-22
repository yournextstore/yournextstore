"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="eyebrow flex items-center gap-2 px-1 py-2 text-ink/80 transition-colors hover:text-ink"
			aria-label="Shopping cart"
		>
			<span>Cart</span>
			<span
				aria-live="polite"
				className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[10px] font-medium text-cream tabular-nums"
			>
				{itemCount}
			</span>
		</button>
	);
}
