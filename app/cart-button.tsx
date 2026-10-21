"use client";

import { useCart } from "@/app/cart/cart-context";

export function BagIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden
		>
			<path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
		</svg>
	);
}

/** The original's bag: grey outline icon, the count in plain type beside it. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="group -m-2 flex items-center p-2"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<BagIcon className="size-6 shrink-0 text-subtle transition-colors group-hover:text-gray-500" />
			<span aria-live="polite" className="ml-2 text-sm font-medium text-gray-700 tabular-nums">
				{itemCount}
			</span>
		</button>
	);
}
