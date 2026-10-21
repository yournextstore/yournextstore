"use client";

import { useCart } from "@/app/cart/cart-context";
import { BagIcon } from "@/components/shapes";

export function CartButton() {
	const { itemCount, openCart } = useCart();
	const count = String(itemCount).padStart(2, "0");

	return (
		<button
			type="button"
			onClick={openCart}
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
			className="cart-divider flex items-center gap-1 border-ink font-semibold uppercase transition-colors hover:text-tangerine-ink sp-lg:ml-5 sp-lg:border-l-2 sp-lg:py-[25px] sp-lg:pl-[50px] sp-xl:py-[35px]"
		>
			<BagIcon className="size-4" />
			<span aria-hidden="true" className="whitespace-nowrap">
				Cart ({count})
			</span>
		</button>
	);
}
