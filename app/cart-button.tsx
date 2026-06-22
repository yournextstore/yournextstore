"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-9 items-center gap-1.5 rounded-full bg-[color:var(--mint-deep)] px-3 text-xs font-semibold text-[color:var(--mint-soft)] transition-colors hover:bg-[color:var(--mint-deep)]/90"
			aria-label="Shopping cart"
		>
			<ShoppingBagIcon className="h-4 w-4" />
			<span className="hidden sm:inline">Cart</span>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--mint)] px-1.5 text-[10px] font-bold text-[color:var(--mint-deep)]"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
