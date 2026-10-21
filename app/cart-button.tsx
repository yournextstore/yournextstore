"use client";

import { useCart } from "@/app/cart/cart-context";
import { BagIcon } from "@/components/icons";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex size-8 items-center justify-center text-ink transition-transform hover:scale-105"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<BagIcon className="h-[26px] w-[21px]" />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute right-0 bottom-0 flex size-4 items-center justify-center rounded-full bg-ink text-[11px] text-white"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
