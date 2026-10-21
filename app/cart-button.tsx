"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative -mr-2.5 grid size-11 place-items-center rounded-full transition-colors hover:bg-secondary lg:mr-0"
			aria-label={itemCount === 1 ? "Open cart, 1 item" : `Open cart, ${itemCount} items`}
		>
			<ShoppingBag aria-hidden="true" className="size-5" strokeWidth={1.75} />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute right-1 top-1 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-copper px-1 text-[0.6875rem] font-semibold leading-none text-on-feature tabular-nums dark:text-background"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
