"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { squareButton } from "@/components/bento/styles";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className={squareButton}
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingCart className="h-4 w-4 transition-all ease-in-out hover:scale-110" aria-hidden="true" />
			{itemCount > 0 ? (
				<span className="absolute top-0 right-0 -mt-2 -mr-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[11px] font-bold text-black">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
