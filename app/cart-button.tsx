"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex items-center gap-2 px-3 h-8 rounded-full border border-border hover:border-foreground/40 transition-colors font-mono text-[10px] uppercase tracking-[0.22em] text-foreground"
			aria-label="Shopping cart"
		>
			<span className="text-foreground/40">[</span>
			<span>Bag</span>
			<span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-cyan-200 text-background text-[10px] px-1">
				{itemCount}
			</span>
			<span className="text-foreground/40">]</span>
		</button>
	);
}
