"use client";

import { useCart } from "@/app/cart/cart-context";
import { CartIcon } from "@/components/gf/icons";
import { gfIconButton } from "@/lib/gf-styles";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className={gfIconButton}
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<CartIcon />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-700 px-1 text-gf-xs font-bold text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
