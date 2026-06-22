"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="heritage-smallcaps relative inline-flex items-center gap-2 py-1.5 px-1 text-[var(--ink)] hover:text-[var(--oxblood)] transition-colors"
			aria-label="Shopping cart"
		>
			<span>Cart</span>
			<span
				aria-live="polite"
				className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-[var(--ink)]/30 px-1.5 text-[10px] font-medium tracking-normal font-sans"
			>
				{itemCount}
			</span>
		</button>
	);
}
