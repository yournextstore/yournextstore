"use client";

import { ShoppingBasketIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { Button } from "@/components/ui/button";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={openCart}
			className="relative"
			aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
		>
			<ShoppingBasketIcon className="h-4" aria-hidden />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</Button>
	);
}
