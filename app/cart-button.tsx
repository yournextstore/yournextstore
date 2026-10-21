"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			<circle cx="6" cy="19" r="2" />
			<circle cx="17" cy="19" r="2" />
			<path d="M17 17h-11v-14h-2" />
			<path d="M6 5l14 1l-1 7h-13" />
		</svg>
	);
}

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-input bg-background shadow-xs transition-colors hover:bg-accent"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground"
				>
					{itemCount}
				</span>
			) : null}
			<CartIcon className="size-4" />
		</button>
	);
}
