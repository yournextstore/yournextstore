"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-current/10"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingCartIcon className="h-5 w-5" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute right-0.5 top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.6875rem] font-semibold leading-none text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
