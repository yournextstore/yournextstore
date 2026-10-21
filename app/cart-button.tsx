"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative p-2 transition-opacity hover:opacity-75"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute top-0 left-5 inline-flex min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#b91c1c] px-1 font-semibold text-white text-xs leading-4"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
