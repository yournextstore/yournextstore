"use client";

import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<div className="flex items-center gap-1">
			<button
				type="button"
				className="hidden p-2 text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
				aria-label="Account"
			>
				<User className="h-5 w-5" strokeWidth={1.5} />
			</button>
			<button
				type="button"
				onClick={openCart}
				className="relative p-2 text-foreground/80 transition-colors hover:text-foreground"
				aria-label="Shopping cart"
			>
				<ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
				{itemCount > 0 ? (
					<span
						aria-live="polite"
						className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center bg-[#ffcc00] px-1 text-[10px] font-bold leading-none text-[#0e0e0e]"
					>
						{itemCount}
					</span>
				) : null}
			</button>
		</div>
	);
}
