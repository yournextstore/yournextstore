"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex size-9 items-center justify-center text-ink transition-opacity hover:opacity-70"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingCartIcon aria-hidden className="size-5" strokeWidth={2} />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-background"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
