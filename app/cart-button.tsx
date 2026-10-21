"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-full p-2 text-ink transition-colors hover:bg-secondary"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingCart className="h-[1.375rem] w-[1.375rem]" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-electric px-1 text-xs font-medium text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
