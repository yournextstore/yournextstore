"use client";

import { useCart } from "@/app/cart/cart-context";
import { BagIcon } from "@/components/icons";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<BagIcon className="size-6 lg:size-5" />
			<span
				aria-hidden="true"
				className="absolute top-0.5 right-0.5 flex size-[18px] items-center justify-center rounded-full bg-plum text-[10px] font-semibold text-plum-foreground"
			>
				{itemCount}
			</span>
		</button>
	);
}
