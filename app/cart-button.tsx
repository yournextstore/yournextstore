"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex items-center justify-center w-9 h-9 hover:bg-accent/40 transition-colors"
			aria-label="Shopping bag"
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="text-foreground"
				aria-hidden="true"
			>
				<path
					d="M3.5 6.5h13l-1 11a1.5 1.5 0 0 1-1.5 1.35h-8A1.5 1.5 0 0 1 4.5 17.5l-1-11z"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeLinejoin="round"
				/>
				<path d="M7 6.5V5a3 3 0 0 1 6 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			</svg>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-accent text-foreground text-[10px] font-medium rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
