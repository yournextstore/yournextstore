"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-md p-2.5 transition hover:bg-current/10"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<svg
				aria-hidden
				width="19"
				height="19"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="9" cy="21" r="1.4" />
				<circle cx="19" cy="21" r="1.4" />
				<path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L22 7H6" />
			</svg>
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute -top-0.5 -right-0.5 rounded-full bg-brass px-1.5 py-0.5 text-[10px] font-semibold leading-none text-on-brass"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
