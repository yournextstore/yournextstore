"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-0.5 -right-0.5 text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center text-white"
					style={{
						background: "linear-gradient(135deg, #d946c4 0%, #a855f7 100%)",
						boxShadow: "0 0 14px rgba(217, 70, 196, 0.55)",
					}}
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
