"use client";

import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<div className="flex items-center gap-1">
			<button
				type="button"
				className="hidden sm:inline-flex p-2 hover:bg-white/30 rounded-full transition-colors text-[var(--color-navy)]"
				aria-label="Account"
			>
				<User className="w-5 h-5" />
			</button>
			<button
				type="button"
				onClick={openCart}
				className="p-2 hover:bg-white/30 rounded-full transition-colors relative text-[var(--color-navy)]"
				aria-label="Shopping cart"
			>
				<ShoppingBag className="w-5 h-5" />
				{itemCount > 0 ? (
					<span
						aria-live="polite"
						className="absolute -top-0.5 -right-0.5 bg-[var(--color-coral)] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center px-1"
					>
						{itemCount}
					</span>
				) : null}
			</button>
		</div>
	);
}
