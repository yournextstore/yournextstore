"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative p-1"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingCart className="size-[22px]" strokeWidth={2} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute -top-2 left-1/2 flex h-4 min-w-4 -translate-x-1/2 items-center justify-center rounded-full bg-black px-1 text-[11px] leading-none font-medium text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
