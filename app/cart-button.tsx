"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="h-9 w-9 inline-flex items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-cream transition-colors relative"
			aria-label="Shopping bag"
		>
			<ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-forest text-cream text-[10px] font-medium rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
