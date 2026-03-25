"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex h-10 w-10 items-center justify-center border border-border/80 bg-background transition-colors hover:bg-[var(--surface-soft)]"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="h-[1.125rem] w-[1.125rem]" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -right-1 -top-1 flex min-h-[1.1rem] min-w-[1.1rem] items-center justify-center bg-foreground px-1 text-[0.62rem] text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
