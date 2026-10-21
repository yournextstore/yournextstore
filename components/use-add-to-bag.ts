"use client";

import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { trackAddToCart } from "@/lib/track";

export type BagVariant = {
	id: string;
	sku?: string | null;
	price: string;
	priceGross?: string | null;
	images: string[];
};

export type BagProduct = {
	id: string;
	name: string;
	slug: string;
	images: string[];
};

/**
 * One add-to-bag for the hero, the cards' quick add and anything else outside the product
 * page: instant local feedback, then the server-returned cart replaces it.
 */
export function useAddToBag() {
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();

	return (variant: BagVariant, product: BagProduct, quantity = 1) => {
		trackAddToCart(
			{ id: variant.id, sku: variant.sku ?? null, price: variant.price },
			product.name,
			quantity,
		);
		openCart();
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity,
				productVariant: {
					id: variant.id,
					price: variant.price,
					priceGross: variant.priceGross,
					images: variant.images,
					product,
				},
			},
		});
		startMutation(async () => {
			const result = await addToCart(variant.id, quantity);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variant.id);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This piece is out of stock");
			}
		});
	};
}
