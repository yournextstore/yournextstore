"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="flex h-9 min-w-9 cursor-pointer items-center justify-center gap-1.5 px-1 text-[10px] tracking-[0.12em]"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<svg
				aria-hidden
				width="15"
				height="17"
				viewBox="0 0 15 17"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.1"
			>
				<rect x="1" y="5" width="13" height="11" />
				<path d="M4.6 5.2V3.6a2.9 2.9 0 0 1 5.8 0v1.6" />
			</svg>
			<span aria-hidden>{itemCount}</span>
		</button>
	);
}
