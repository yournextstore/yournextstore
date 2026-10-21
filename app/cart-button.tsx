"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-accent"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingBagIcon className="size-4" />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-tiny leading-none font-semibold text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
