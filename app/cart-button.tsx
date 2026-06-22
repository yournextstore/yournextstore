"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex items-center justify-center w-11 h-11 rounded-full text-[var(--tizz-deep)] hover:bg-[var(--tizz-deep)]/10 transition-colors"
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-6 h-6" strokeWidth={2.5} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 bg-[var(--tizz-orange)] text-[var(--tizz-cream)] text-[10px] font-extrabold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center border-2 border-[var(--tizz-yellow)]"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
