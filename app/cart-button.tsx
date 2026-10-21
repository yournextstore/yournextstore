"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="font-readout inline-flex items-center gap-2 rounded-[4px] border border-line px-3 py-[6px] text-[0.8rem] tracking-[0.04em] whitespace-nowrap text-ink transition-colors hover:border-dim hover:bg-ink/[.03]"
			aria-label={`Cart ${String(itemCount).padStart(2, "0")}, ${itemCount} ${itemCount === 1 ? "item" : "items"}, open cart`}
		>
			Cart{" "}
			<span aria-live="polite" className="tabular-nums text-copper">
				{String(itemCount).padStart(2, "0")}
			</span>
		</button>
	);
}
