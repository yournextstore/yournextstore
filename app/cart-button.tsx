"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="group inline-flex items-center gap-2 px-3 h-9 text-[12px] tracking-[0.18em] uppercase text-foreground/80 hover:text-foreground transition-colors relative"
			aria-label="Shopping bag"
		>
			<ShoppingBag className="w-4 h-4" />
			<span className="hidden sm:inline">Bag</span>
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] tracking-normal"
					style={{ backgroundColor: "#1A1A1A", color: "#F4F1EC" }}
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
