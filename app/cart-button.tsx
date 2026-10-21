"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-secondary"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<ShoppingCart className="size-6" strokeWidth={2} aria-hidden />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-medium text-brand-foreground"
				>
					{itemCount > 99 ? "99+" : itemCount}
				</span>
			) : null}
		</button>
	);
}
