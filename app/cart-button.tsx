"use client";

import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<div className="flex items-center gap-1">
			<button
				type="button"
				className="p-2 hover:bg-white/15 rounded-full transition-colors text-white"
				aria-label="Account"
			>
				<User className="w-5 h-5" />
			</button>
			<button
				type="button"
				onClick={openCart}
				className="p-2 hover:bg-white/15 rounded-full transition-colors relative text-white"
				aria-label="Shopping cart"
			>
				<ShoppingCart className="w-5 h-5" />
				{itemCount > 0 ? (
					<span
						aria-live="polite"
						className="absolute -top-0.5 -right-0.5 bg-gold text-soot text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
					>
						{itemCount}
					</span>
				) : null}
			</button>
		</div>
	);
}
