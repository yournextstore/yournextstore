"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="group relative inline-flex items-center gap-2 px-3 py-2 text-[12px] tracking-[0.18em] uppercase text-foreground/85 hover:text-[color:var(--oxblood)] transition-colors"
			aria-label="Shopping bag"
		>
			<ShoppingBag className="w-4 h-4 stroke-[1.5]" />
			<span className="hidden sm:inline">
				Bag
				{itemCount > 0 ? (
					<span aria-live="polite" className="ml-1 text-[color:var(--oxblood)]">
						({itemCount})
					</span>
				) : null}
			</span>
			{itemCount > 0 ? (
				<span className="sm:hidden absolute -top-0.5 -right-0.5 bg-[color:var(--oxblood)] text-cream text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
