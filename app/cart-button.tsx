"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative -mr-[10px] flex h-[60px] w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground lg:mr-0 lg:w-[50px]"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<ShoppingCartIcon aria-hidden className="size-5" strokeWidth={1.25} />
			{itemCount > 0 ? (
				<span aria-hidden className="uk-badge absolute top-[12px] right-0 lg:right-[6px]">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
