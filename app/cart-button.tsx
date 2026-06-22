"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative p-1 text-foreground/80 hover:text-foreground transition-colors"
			aria-label="Shopping bag"
		>
			<ShoppingBag className="w-5 h-5" strokeWidth={1.4} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-ink text-cream text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-medium"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
