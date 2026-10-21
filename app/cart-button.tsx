"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="flex h-10 min-w-10 items-center justify-center gap-2 border border-transparent px-2.5 transition hover:border-current"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<svg
				aria-hidden
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="9" cy="21" r="1.4" />
				<circle cx="19" cy="21" r="1.4" />
				<path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L22 7H6" />
			</svg>
			{/* The original's bare count beside the icon, no bubble. */}
			{itemCount > 0 ? (
				<span aria-hidden className="text-[13px] font-medium tracking-wide">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
