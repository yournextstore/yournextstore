"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-10 w-10 items-center justify-center rounded-xs transition-opacity hover:opacity-70"
			aria-label={`Open cart (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
		>
			{/* The original's tote: a box with a smile-shaped handle cut. */}
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.25"
				strokeLinejoin="round"
				className="h-5 w-5"
			>
				<rect x="3.75" y="4.75" width="16.5" height="15.5" rx="1.5" />
				<path d="M3.75 8.25h16.5" />
				<path d="M8.75 11.25a3.25 3.25 0 0 0 6.5 0" strokeLinecap="round" />
			</svg>
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute top-0.5 right-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] leading-none font-medium text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
