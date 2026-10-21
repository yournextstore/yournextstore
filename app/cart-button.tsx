"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-secondary"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<ShoppingBag className="size-6" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute right-0.5 top-0.5 flex size-[1.125rem] items-center justify-center rounded-full bg-primary text-[0.6875rem] font-semibold leading-none text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
