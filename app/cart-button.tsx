"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-full p-2 text-[#2A2A2A] transition-colors hover:bg-[#8C1F2A]/10 hover:text-[#8C1F2A]"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="h-6 w-6" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8C1F2A] text-xs font-bold text-[#FAF2E6]"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
