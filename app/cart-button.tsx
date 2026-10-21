"use client";

import { useCart } from "@/app/cart/cart-context";
import { IconBasket } from "@/components/garden/icons";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="icon-btn"
			aria-label={itemCount > 0 ? `Open basket, ${itemCount} items` : "Open basket"}
		>
			<IconBasket />
			{itemCount > 0 ? (
				<span aria-live="polite" className="icon-btn__badge">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
