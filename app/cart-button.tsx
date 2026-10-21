"use client";

import { useCart } from "@/app/cart/cart-context";

/** The cart: an ink pill with the count in a yellow bubble. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-ink pl-4 pr-1.5 text-[0.95rem] font-bold uppercase tracking-wide text-sun transition-colors hover:bg-[#0c4a6e]"
			aria-label={`Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<span className="pt-0.5">Cart</span>{" "}
			<span
				className="grid h-7 min-w-7 place-items-center rounded-full bg-sun px-1.5 pt-0.5 text-[0.85rem] tabular-nums text-ink"
				aria-hidden="true"
			>
				{itemCount}
			</span>
		</button>
	);
}
