"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex items-center gap-2 px-1 py-2 text-slate-600 transition hover:text-slate-900"
			aria-label={`Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingCart className="size-[18px]" aria-hidden />
			<span className="max-sm:sr-only">Cart</span>
			<span
				aria-hidden
				className="absolute -top-0 left-3 flex size-3.5 items-center justify-center rounded-full bg-slate-600 text-[8px] text-white"
			>
				{itemCount}
			</span>
		</button>
	);
}
