"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="group -m-2 flex items-center p-2"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingCart className="h-6 w-6 shrink-0 text-gray-500 group-hover:text-gray-600" aria-hidden="true" />
			<span aria-live="polite" className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
				{itemCount}
			</span>
		</button>
	);
}
