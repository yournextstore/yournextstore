"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-full p-2 transition-colors hover:bg-white/10"
			aria-label={
				itemCount > 0 ? `Open cart (${itemCount} ${itemCount === 1 ? "item" : "items"})` : "Open cart"
			}
		>
			<ShoppingBag className="size-5" strokeWidth={1.5} aria-hidden="true" />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-sand px-1 text-[0.6875rem] font-bold text-ink"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
