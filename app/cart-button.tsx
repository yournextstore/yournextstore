"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-mauve/40 transition-colors"
			aria-label="Shopping cart"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
				className="h-5 w-5"
			>
				<title>Cart</title>
				<path d="M6 7h12l-1.2 13.2A2 2 0 0 1 14.81 22H9.19a2 2 0 0 1-1.99-1.8L6 7Z" />
				<path d="M9 7V5a3 3 0 1 1 6 0v2" />
			</svg>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
