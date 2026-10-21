"use client";

import { useCart } from "@/app/cart/cart-context";

export function BagIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.75}
			strokeLinejoin="round"
			className={className}
			aria-hidden
		>
			<path d="M4.5 8.5h15l-1.2 12h-12.6z" />
			<path d="M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5" strokeLinecap="round" />
		</svg>
	);
}

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="-mr-1 flex h-10 items-center gap-0.5 px-1"
			aria-label={`Open cart (${itemCount})`}
		>
			<BagIcon className="size-[1.375rem]" />
			<span aria-live="polite" className="text-xs font-medium tabular-nums">
				({itemCount})
			</span>
		</button>
	);
}
