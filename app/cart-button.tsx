"use client";

import { useCart } from "@/app/cart/cart-context";
import { MaterialIcon } from "@/components/icons/material-icon";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-primary/30"
			aria-label="Shopping cart"
		>
			<MaterialIcon name="shopping_bag" className="text-sm" />
			{itemCount > 0 ? (
				<span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
