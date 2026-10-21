"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-pine"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingBag className="size-5" strokeWidth={1.75} />
			<span
				aria-hidden="true"
				className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground tabular-nums"
			>
				{itemCount}
			</span>
		</button>
	);
}
