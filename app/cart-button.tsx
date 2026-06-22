"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-full p-2 text-[color:#fff8ec] transition-colors hover:bg-white/10"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[color:#0f2a3f] text-[10px] font-bold text-[color:#fff8ec]"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
