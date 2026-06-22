"use client";

import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<div className="flex items-center gap-1">
			<button
				type="button"
				className="p-2 rounded-full text-foreground/85 hover:text-magenta hover:bg-blush-soft transition-colors"
				aria-label="Account"
			>
				<User className="h-5 w-5" />
			</button>
			<button
				type="button"
				onClick={openCart}
				className="relative p-2 rounded-full text-foreground/85 hover:text-magenta hover:bg-blush-soft transition-colors"
				aria-label="Shopping cart"
			>
				<ShoppingBag className="h-5 w-5" />
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-magenta text-white text-[10px] font-semibold flex items-center justify-center"
				>
					{itemCount}
				</span>
			</button>
		</div>
	);
}
