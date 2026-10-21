"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

/** The honey-yellow round bag button with the original's rose count bubble. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-honey text-white shadow-sm transition-colors hover:bg-amber-800 md:mx-2 md:h-10 md:w-10"
			aria-label={itemCount > 0 ? `Open bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open bag"}
		>
			<ShoppingBag className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} aria-hidden />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-badge text-xs font-bold text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
