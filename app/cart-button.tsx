"use client";

import { useCart } from "@/app/cart/cart-context";
import { BagIcon } from "@/components/icons";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-tonal-hover/60 xs:size-12"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<BagIcon className="size-5" />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute top-1 right-0.5 flex size-5 items-center justify-center rounded-full bg-alert text-caption leading-none text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
