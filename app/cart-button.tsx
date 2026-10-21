"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-9 items-center justify-center"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingBagIcon aria-hidden className="size-5" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="cart-count absolute top-0.5 right-0 flex size-4 items-center justify-center rounded-full bg-foreground text-[0.625rem] leading-none text-background"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
