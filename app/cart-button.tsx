"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-full p-2 transition-colors hover:bg-secondary"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="h-5 w-5" strokeWidth={2.2} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-zap text-[10px] font-bold text-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
