"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-lg p-1.5 text-zinc-900 transition-colors hover:text-zinc-600"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingBag className="pointer-events-none h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.4} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-900 text-[12px] text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
