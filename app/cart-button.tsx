"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

/** "Bag · n" in the masthead. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="flex min-h-6 cursor-pointer items-center gap-1.5 text-soft transition hover:text-acc"
		>
			<ShoppingBag aria-hidden className="size-[13px]" strokeWidth={1.5} />
			<span aria-live="polite">
				<span className="hidden sm:inline">Bag · </span>
				<span className="sr-only sm:hidden">Bag </span>
				{itemCount}
			</span>
		</button>
	);
}
