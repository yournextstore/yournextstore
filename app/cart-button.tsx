"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { BtnLabel } from "@/components/grilli/btn-label";

/** The original's gold "Find a table" button, turned into the cart; a bag icon on phones. */
export function CartButton() {
	const { itemCount, openCart } = useCart();
	const label = `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`;

	return (
		<>
			<button
				type="button"
				onClick={openCart}
				aria-label={label}
				className="relative inline-flex size-11 cursor-pointer items-center justify-center text-white transition-colors hover:text-gold xs:hidden"
			>
				<ShoppingBagIcon className="size-6" strokeWidth={1.5} aria-hidden="true" />
				{itemCount > 0 && (
					<span
						aria-hidden="true"
						className="absolute top-0.5 right-0 flex size-5 items-center justify-center rounded-full bg-gold text-[0.6875rem] font-bold text-smoky"
					>
						{itemCount}
					</span>
				)}
			</button>
			<button
				type="button"
				onClick={openCart}
				aria-label={label}
				data-variant="solid"
				className="btn-g hidden min-w-[11.5rem] xs:inline-flex"
			>
				<BtnLabel>{`Your cart (${itemCount})`}</BtnLabel>
			</button>
		</>
	);
}
