"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:text-primary-hover md:h-9 md:w-9"
			aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute top-0.5 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[0.6875rem] font-bold leading-none text-primary-foreground md:-top-1 md:-right-1.5"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
