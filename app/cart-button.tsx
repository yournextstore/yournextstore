"use client";

import { useCart } from "@/app/cart/cart-context";
import { BagIcon } from "@/components/mandala/icons";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex size-11 items-center justify-center text-ink-foreground transition-opacity hover:opacity-75"
			aria-label={itemCount > 0 ? `Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Cart"}
		>
			<BagIcon className="size-6" />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-indigo text-xs text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
