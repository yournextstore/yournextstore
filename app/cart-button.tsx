"use client";

import { useCart } from "@/app/cart/cart-context";
import { BagIcon } from "@/components/icons";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-8 items-center justify-center"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<BagIcon className="size-6" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute top-0.5 right-0 flex size-4 items-center justify-center rounded-full bg-foreground text-body-2xs leading-none text-background"
				>
					{itemCount > 99 ? "99+" : itemCount}
				</span>
			) : null}
		</button>
	);
}
