"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="chip-btn"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingBag className="size-7" strokeWidth={1.5} aria-hidden="true" />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute -top-1 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--badge) px-1 text-[10px] font-semibold text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
