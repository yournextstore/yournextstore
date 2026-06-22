"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-secondary rounded-full transition-colors relative"
			aria-label="Shopping bag"
		>
			<ShoppingBag className="w-5 h-5" strokeWidth={1.4} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute top-1.5 right-1.5 bg-[color:var(--sale)] text-[9px] leading-none font-medium text-white rounded-full min-w-[14px] h-[14px] px-1 flex items-center justify-center ring-2 ring-background"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
