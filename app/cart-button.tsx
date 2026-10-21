"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative -left-2 flex items-center justify-center rounded-md p-1"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingCart aria-hidden size={26} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute -top-2 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
