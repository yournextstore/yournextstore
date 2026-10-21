"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative -mr-2 inline-flex size-10 items-center justify-center text-ink transition-opacity hover:opacity-70"
			aria-label={itemCount > 0 ? `Open bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open bag"}
		>
			<ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[0.625rem] font-semibold leading-none text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
