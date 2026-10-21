"use client";

import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();
	const count = itemCount > 99 ? "99+" : String(itemCount);

	return (
		<button
			type="button"
			onClick={openCart}
			aria-label={itemCount > 0 ? `Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Cart"}
			className="inline-flex items-center uppercase tracking-widest transition-colors hover:text-foreground"
		>
			Cart
			{/* Width reserved up front so the count arriving after hydration never nudges the row. */}
			<span className="inline-block min-w-[4ch] tabular-nums">{itemCount > 0 ? `\u00a0(${count})` : ""}</span>
		</button>
	);
}
