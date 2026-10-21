"use client";

import { useCart } from "@/app/cart/cart-context";
import { BagIcon } from "@/components/icons";

export function CartButton() {
	const { itemCount, openCart } = useCart();
	const label = `Bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`;

	return (
		<button
			type="button"
			onClick={openCart}
			aria-label={label}
			className="relative inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-ink/85 transition-colors hover:text-gold"
		>
			<BagIcon />
			<span
				aria-hidden="true"
				className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-gold text-[11px] font-medium leading-none text-page"
			>
				{itemCount}
			</span>
		</button>
	);
}
