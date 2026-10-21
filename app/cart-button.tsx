"use client";

import { useCart } from "@/app/cart/cart-context";
import { cn } from "@/lib/utils";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="flex cursor-pointer items-center p-2 text-nav font-semibold uppercase md:ml-2"
			aria-label={`Cart ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
		>
			Cart{" "}
			<span
				aria-live="polite"
				className={cn(
					"ml-2 flex size-8 items-center justify-center rounded-full border border-current text-sm leading-none font-bold tabular-nums",
					itemCount > 0 && "border-foreground bg-foreground text-background animate-[hull-pulse_2s_infinite]",
				)}
			>
				{itemCount}
			</span>
		</button>
	);
}
