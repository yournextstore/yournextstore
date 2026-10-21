"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";

/** "Cart · 2 items · $134.00" on desktop, a bag with a count on phones. */
export function CartButton() {
	const { currency, locale } = useStoreConfig();
	const { itemCount, subtotal, openCart } = useCart();
	const items = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

	return (
		<button
			type="button"
			onClick={openCart}
			aria-label={itemCount > 0 ? `Open cart, ${items}` : "Open cart"}
			className="relative inline-grid size-11 place-items-center justify-self-end lg:flex lg:size-auto lg:min-w-40 lg:justify-end lg:text-label-md lg:hover:underline"
		>
			<ShoppingBagIcon aria-hidden="true" className="size-6 lg:hidden" strokeWidth={1.5} />
			{itemCount > 0 ? (
				<span
					aria-hidden="true"
					className="absolute top-1.5 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground lg:hidden"
				>
					{itemCount}
				</span>
			) : null}
			<span aria-hidden="true" className="hidden whitespace-nowrap lg:inline">
				Cart
				{itemCount > 0 ? ` · ${items} · ${formatMoney({ amount: subtotal, currency, locale })}` : ""}
			</span>
		</button>
	);
}
