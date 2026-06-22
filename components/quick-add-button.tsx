"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { itemKey, lineKey } from "@/app/cart/cart-math";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { trackAddToCart } from "@/lib/track";

type QuickAddButtonProps = {
	variantId: string;
	variantSku?: string | null;
	variantPrice: string;
	/** Gross twin of `variantPrice`, so the optimistic cart line matches the store's tax behaviour. */
	variantPriceGross?: string | null;
	variantImages: string[];
	product: {
		id: string;
		name: string;
		slug: string;
		images: string[];
	};
};

export function QuickAddButton({
	variantId,
	variantSku,
	variantPrice,
	variantPriceGross,
	variantImages,
	product,
}: QuickAddButtonProps) {
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	// Local to this button: the pulse and the disabled state show this card's add, not the whole cart.
	const [isPending, setIsPending] = useState(false);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		trackAddToCart({ id: variantId, sku: variantSku, price: variantPrice }, product.name, 1);

		openCart();

		// Instant local feedback OUTSIDE the transition, then REPLACE with the
		// server-returned cart (never refetch — cartGet reads a replica that can lag the
		// write). The transition keeps Checkout disabled until the write lands.
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
				productVariant: {
					id: variantId,
					price: variantPrice,
					priceGross: variantPriceGross,
					images: variantImages,
					product,
				},
			},
		});

		setIsPending(true);
		startMutation(async () => {
			try {
				// The server clamps to available stock and still returns the cart — surface
				// the failure instead of letting the optimistic item silently vanish.
				const result = await addToCart(variantId, 1);
				const line = result.cart?.lineItems.find((item) => itemKey(item) === lineKey(variantId));
				if (result.success && result.cart && line) {
					syncCart(result.cart);
				} else {
					await reconcile();
					toast.error("This item is out of stock");
				}
			} finally {
				setIsPending(false);
			}
		});
	};

	return (
		<Tooltip>
			<TooltipTrigger
				delay={1000}
				onClick={handleClick}
				disabled={isPending}
				className="absolute bottom-3 right-3 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#0f0f0f] text-white shadow-md transition-all hover:bg-[#ff6b35] hover:scale-105 active:scale-95 disabled:opacity-50"
				aria-label={`Add ${product.name} to cart`}
			>
				<PlusIcon className={`h-4 w-4 ${isPending ? "animate-pulse" : ""}`} />
			</TooltipTrigger>
			<TooltipContent side="top" className="text-xs">
				Add to cart
			</TooltipContent>
		</Tooltip>
	);
}
