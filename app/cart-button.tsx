"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="h-4 w-4" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] font-medium rounded-full min-w-5 h-5 px-1 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
