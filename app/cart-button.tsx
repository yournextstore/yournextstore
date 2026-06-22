"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-full p-1.5 text-[var(--brand-ink)] transition-colors hover:bg-[var(--brand-ink)]/5"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand-ember)] px-1 font-mono-ed text-[9px] font-medium text-[var(--brand-cream)]"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
