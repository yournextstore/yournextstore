"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { Arrow } from "@/components/bakery/arrow";
import { buttonClass } from "@/lib/ui";

/** Desktop: the original's burgundy "Contact →" button, now the cart. Mobile: a bag with a count. */
export function CartButton() {
	const { itemCount, openCart } = useCart();
	const countLabel = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

	return (
		<>
			<button
				type="button"
				onClick={openCart}
				aria-label={`Cart, ${countLabel}`}
				className={buttonClass({ size: "medium", className: "hidden lg:inline-flex" })}
			>
				<span>
					Cart{" "}
					<span aria-live="polite" className="tabular-nums">
						({itemCount})
					</span>
				</span>
				<Arrow />
			</button>
			<button
				type="button"
				onClick={openCart}
				aria-label={`Cart, ${countLabel}`}
				className="relative rounded-md p-2 text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-hover lg:hidden"
			>
				<ShoppingBag aria-hidden="true" className="h-6 w-6" />
				{itemCount > 0 ? (
					<span className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 font-sans text-[0.6875rem] font-bold text-on-fill tabular-nums">
						{itemCount}
					</span>
				) : null}
			</button>
		</>
	);
}
