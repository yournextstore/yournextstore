"use client";

import { useCart } from "@/app/cart/cart-context";
import { BasketIcon } from "@/components/frntr-icons";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex size-11 items-center justify-center text-foreground"
			aria-label={`Open basket, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<BasketIcon />
			{/* Always shown, as in the original (a "0" bubble on an empty basket). */}
			<span
				aria-hidden="true"
				className="absolute top-0.5 right-0 flex size-[18px] items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-white"
			>
				{itemCount}
			</span>
		</button>
	);
}
