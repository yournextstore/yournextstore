"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { cn } from "@/lib/utils";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative -mr-1.5 inline-flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-70"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.75} />
			{/* Count only rendered when non-zero, so the hidden "0" never contradicts the label. */}
			<span
				aria-hidden="true"
				className={cn(
					"absolute top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground transition-transform duration-200",
					itemCount === 0 ? "scale-0" : "scale-100",
				)}
			>
				{itemCount > 0 ? itemCount : null}
			</span>
		</button>
	);
}
