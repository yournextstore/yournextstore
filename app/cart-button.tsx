"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="nav-underline relative flex items-center gap-x-2 px-1 py-1"
			aria-label={itemCount > 0 ? `Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Cart"}
		>
			<ShoppingCart aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
			<span className="hidden md:inline">Cart</span>
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute -top-2 -right-2 inline-flex min-w-5 items-center justify-center rounded-full bg-mint px-1.5 py-0.5 text-xs font-semibold leading-none text-foreground md:-top-1.5 md:right-auto md:-left-2"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
