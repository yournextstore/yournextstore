"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { headerIconButton } from "@/components/header/icon-button";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className={headerIconButton}
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground ring-1 ring-background"
				>
					{itemCount}
				</span>
			) : null}
			<ShoppingCart aria-hidden="true" className="size-4" />
		</button>
	);
}
