"use client";

import { useCart } from "@/app/cart/cart-context";
import { CartIcon } from "@/components/njx/icons";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex items-center gap-1.5 rounded-md border border-line px-3 py-2.5 hover:border-ink sm:px-3.5"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<CartIcon />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute -top-1.5 -right-1.5 rounded-full bg-pine px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
