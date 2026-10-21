"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex h-10 items-center gap-0.5 rounded-full px-2 transition-colors hover:bg-secondary"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				className="h-6 w-6"
			>
				<path
					d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<span aria-hidden="true" className="text-xs tabular-nums">
				({itemCount})
			</span>
		</button>
	);
}
