"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:opacity-60 transition-opacity relative"
			aria-label="Shopping bag"
		>
			<ShoppingBag className="w-[18px] h-[18px]" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-[var(--olive-dark)] text-[var(--cream)] text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
