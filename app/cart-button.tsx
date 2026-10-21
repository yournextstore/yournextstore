"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-secondary"
			aria-label={`Open cart (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
				className="h-5 w-5"
			>
				<path d="M5.5 8h13l-1 12.5h-11z" />
				<path d="M9 10V6.5a3 3 0 0 1 6 0V10" strokeLinecap="round" />
			</svg>
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute top-0.5 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] leading-none font-medium text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
