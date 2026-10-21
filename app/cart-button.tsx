"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex h-10 w-11 items-center justify-center text-foreground transition-colors hover:bg-secondary"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingBag aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-badge px-1 text-[11px] font-bold leading-none text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
