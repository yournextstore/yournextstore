"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-lg p-1.5 transition-colors hover:bg-contrast-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<ShoppingBag className="size-5" strokeWidth={1} />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-foreground font-mono text-[10px] leading-none text-background"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
