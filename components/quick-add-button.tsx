"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { itemKey, lineKey } from "@/app/cart/cart-math";
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

		startMutation(async () => {
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
		});
	};

	return (
		<div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-focus-within:translate-y-0 group-hover:translate-y-0">
			<button
				type="button"
				onClick={handleClick}
				className="flex w-full items-center justify-center gap-2 rounded-form bg-foreground py-2.5 text-[13px] font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground"
				aria-label={`Add to cart, ${product.name}`}
			>
				<ShoppingBag className="size-4" aria-hidden="true" /> Add to cart
			</button>
		</div>
	);
}
