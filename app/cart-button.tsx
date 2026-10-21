"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex items-center gap-1.5 rounded-[9px] px-[0.6rem] py-[0.45rem] text-[0.86rem] whitespace-nowrap text-dim transition-colors hover:bg-line-2 hover:text-ink"
			aria-label={`Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}, open cart`}
		>
			Cart{" "}
			<span
				aria-live="polite"
				className="font-plate inline-grid min-w-[1.35rem] place-items-center rounded-full bg-led px-1 text-[0.68rem] leading-[1.35rem] font-semibold text-led-ink tabular-nums"
			>
				{itemCount}
			</span>
		</button>
	);
}
