"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="font-field inline-flex items-center gap-1.5 border border-line px-3.5 py-[7px] text-[0.78rem] tracking-[0.04em] whitespace-nowrap text-signal uppercase transition-colors hover:border-signal hover:bg-signal/10"
			aria-label={`Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}, open cart`}
		>
			Cart{" "}
			<span aria-live="polite" className="tabular-nums">
				[{itemCount}]
			</span>
		</button>
	);
}
