"use client";

import { useCart } from "@/app/cart/cart-context";
import { cn } from "@/lib/utils";

/** Ink "Bag · n" pill: opens the bag drawer; the count bumps when it changes. */
export function CartButton({ className }: { className?: string }) {
	const { itemCount, openCart } = useCart();
	const label = itemCount > 0 ? `Bag · ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Bag, empty";

	return (
		<button
			type="button"
			onClick={openCart}
			aria-label={label}
			className={cn(
				"press flex items-center whitespace-nowrap rounded-full bg-foreground font-semibold text-background transition-colors hover:bg-ink-hover",
				className,
			)}
		>
			<span
				key={itemCount}
				aria-hidden="true"
				className={cn("inline-block", itemCount > 0 && "animate-bump")}
			>
				Bag
				{itemCount > 0 ? <span className="tabular-nums"> · {itemCount}</span> : null}
			</span>
		</button>
	);
}
