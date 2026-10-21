"use client";

import { useCart } from "@/app/cart/cart-context";

/** The original's outlined "Next drop" pill, now the bag: it fills with ink on hover. */
export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-ink px-4 text-[0.9rem] font-medium text-ink transition-colors hover:bg-ink hover:text-foam"
			aria-label={`Bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			Bag{" "}
			<span className="mono text-[0.78rem] tabular-nums" aria-hidden="true">
				({itemCount})
			</span>
		</button>
	);
}
