"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative p-1.5 transition-colors hover:text-black"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<ShoppingCart aria-hidden className="h-6 w-6" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute -top-0.5 -right-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.6875rem] text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
