"use client";

import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { cn } from "@/lib/utils";

/** Basket with the original's orange count sticker. `compact` is the phone tab-bar variant. */
export function CartButton({ compact = false }: { compact?: boolean }) {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className={cn(
				"relative flex cursor-pointer items-center justify-center text-ink transition-colors hover:text-tangerine",
				compact ? "size-12" : "size-11",
			)}
			aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			<ShoppingBasket aria-hidden className={compact ? "size-7" : "size-8"} strokeWidth={2} />
			<span
				aria-hidden
				className={cn(
					"absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-tangerine px-1 text-[11px] font-bold leading-none text-white",
					compact ? "right-1 top-1" : "-right-0.5 top-0",
				)}
			>
				{itemCount}
			</span>
		</button>
	);
}
