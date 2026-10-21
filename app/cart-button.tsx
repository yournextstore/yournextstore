"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { Button } from "@/components/ui/button";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<Button
			variant="ghost"
			size="icon-lg"
			onClick={openCart}
			className="relative -mr-2.5"
			aria-label={
				itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Open cart"
			}
		>
			<ShoppingBag className="size-5" aria-hidden />
			{itemCount > 0 ? (
				<span
					aria-hidden
					className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</Button>
	);
}
