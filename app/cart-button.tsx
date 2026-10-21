"use client";

import { useCart } from "@/app/cart/cart-context";
import { pad2 } from "@/lib/pad";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="link-mono -m-2 inline-flex min-h-10 items-center gap-2 p-2 transition-colors hover:text-walnut"
		>
			<span className="hidden sm:inline">Cart</span>{" "}
			<span className="mono text-[0.6875rem]" aria-live="polite">
				{pad2(itemCount)}
				<span className="sr-only"> items in cart</span>
			</span>
		</button>
	);
}
