"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

/** The original's bag icon with its always-visible green count bubble. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex text-gray-600 transition hover:text-green-600"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingBagIcon className="size-6" strokeWidth={1.75} aria-hidden />
			<span
				aria-hidden
				className="absolute top-0 left-full -mt-1 -ml-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-fc-sm leading-none font-semibold text-white"
			>
				{itemCount}
			</span>
		</button>
	);
}
