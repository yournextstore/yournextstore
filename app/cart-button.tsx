"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative rounded-md p-2 text-slate-ink transition-opacity hover:opacity-75"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingBag className="h-5 w-5" strokeWidth={2} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-slate-ink px-1 text-[0.6875rem] font-semibold text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
