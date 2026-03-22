"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/app/[locale]/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();
	const t = useTranslations("Cart");

	return (
		<button
			type="button"
			onClick={openCart}
			className="p-2 hover:bg-secondary rounded-full transition-colors relative"
			aria-label={t("shoppingCart")}
		>
			<ShoppingCart className="w-6 h-6" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
