"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-muted-foreground"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
