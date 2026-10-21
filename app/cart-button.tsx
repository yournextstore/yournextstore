"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center rounded-sm transition-colors hover:bg-tonal"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingCartIcon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-xs bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
