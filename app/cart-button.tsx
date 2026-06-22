"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="group relative flex items-center gap-1.5 h-9 px-3 text-xs text-[var(--yns-ink)] hover:text-[var(--yns-red)] transition-colors"
			aria-label="Shopping cart"
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M3 6h2l2.4 11.4a2 2 0 002 1.6h7.2a2 2 0 002-1.6L20 9H6"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<circle cx="9" cy="21" r="1.2" fill="currentColor" />
				<circle cx="17" cy="21" r="1.2" fill="currentColor" />
			</svg>
			<span className="hidden sm:inline tabular-nums">
				bag<span className="opacity-50">·</span>
				<span aria-live="polite">{itemCount}</span>
			</span>
		</button>
	);
}
