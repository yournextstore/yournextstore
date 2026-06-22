"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative text-foreground/70 transition-colors hover:text-foreground"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-cream"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
