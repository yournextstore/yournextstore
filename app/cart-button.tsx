"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex h-10 items-center gap-2 rounded-full px-3 text-[11px] uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-lilac-soft"
			aria-label="Shopping bag"
		>
			<ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
			<span className="hidden md:inline">Bag</span>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium tracking-normal text-background"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
