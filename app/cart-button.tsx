"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

function InstagramIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<rect width="20" height="20" x="2" y="2" rx="5" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
			<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
		</svg>
	);
}

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<div className="flex items-center gap-1">
			<a
				href="https://instagram.com"
				target="_blank"
				rel="noreferrer"
				aria-label="Instagram"
				className="hidden sm:flex p-2 rounded-full text-black hover:bg-black/5 transition-colors"
			>
				<InstagramIcon className="w-5 h-5" />
			</a>
			<button
				type="button"
				onClick={openCart}
				className="relative p-2 rounded-full text-black hover:bg-black/5 transition-colors"
				aria-label="Shopping cart"
			>
				<ShoppingBag className="w-5 h-5" />
				{itemCount > 0 ? (
					<span
						aria-live="polite"
						className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center"
					>
						{itemCount}
					</span>
				) : null}
			</button>
		</div>
	);
}
