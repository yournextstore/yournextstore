"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="group inline-flex items-center gap-1.5 px-1 py-2 text-[10px] tracking-microcaps text-foreground/80 transition-colors hover:text-saffron"
			aria-label="Shopping cart"
		>
			<span>Cart</span>
			<span
				aria-live="polite"
				className="inline-flex h-4 min-w-4 items-center justify-center px-1 text-[10px] tracking-normal text-foreground/55 group-hover:text-saffron"
			>
				({itemCount})
			</span>
		</button>
	);
}
