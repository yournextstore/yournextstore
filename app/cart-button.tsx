"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative ml-3 hidden p-1 text-neutral-700 transition-colors hover:text-violet lg:block"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet px-1 text-[10px] font-semibold text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
