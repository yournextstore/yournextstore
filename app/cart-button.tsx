"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingBag className="h-6 w-6 max-sm:h-5 max-sm:w-5" strokeWidth={1.5} aria-hidden="true" />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-taupe px-1 text-[10px] leading-none text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
