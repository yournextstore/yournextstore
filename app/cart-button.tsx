"use client";

import { User } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<div className="flex items-center gap-2 sm:gap-4">
			<button
				type="button"
				onClick={openCart}
				className="group inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-semibold text-ink hover:text-terracotta transition-colors"
				aria-label="Shopping cart"
			>
				<span className="hidden sm:inline">Cart</span>
				<span className="relative inline-flex items-center justify-center">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<title>Cart</title>
						<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
						<line x1="3" y1="6" x2="21" y2="6" />
						<path d="M16 10a4 4 0 01-8 0" />
					</svg>
					{itemCount > 0 ? (
						<span
							aria-live="polite"
							className="absolute -top-2 -right-2 bg-terracotta text-cream text-[9px] font-semibold tracking-normal rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center"
						>
							{itemCount}
						</span>
					) : null}
				</span>
			</button>
			<button
				type="button"
				className="hidden sm:inline-flex p-1 text-ink hover:text-terracotta transition-colors"
				aria-label="Account"
			>
				<User className="w-[18px] h-[18px]" strokeWidth={1.6} />
			</button>
		</div>
	);
}
