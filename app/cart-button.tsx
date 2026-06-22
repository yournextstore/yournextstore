"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

export function CartButton() {
	const { itemCount, openCart, subtotal } = useCart();

	const subtotalDisplay = formatMoney({
		amount: subtotal,
		currency: CURRENCY,
		locale: LOCALE,
	});

	return (
		<button
			type="button"
			onClick={openCart}
			className="flex items-center gap-2 neo-border px-3 py-2 bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] transition-colors relative"
			aria-label="Shopping cart"
		>
			<span className="hidden sm:inline font-sans text-sm font-medium tracking-wide">{subtotalDisplay}</span>
			<ShoppingCart className="w-5 h-5" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] font-bold w-5 h-5 flex items-center justify-center neo-border"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
