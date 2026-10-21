"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex size-10 items-center justify-center text-muted-foreground transition-colors hover:bg-tile hover:text-ink"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingCartIcon aria-hidden className="size-[19px]" strokeWidth={1.8} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute right-0.5 top-0.5 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
