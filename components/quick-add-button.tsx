"use client";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
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

/** The card's dark "Add To Cart" button: adds one, confirms with a toast (as the original), cart stays closed. */
export function QuickAddButton({
	variantId,
	variantSku,
	variantPrice,
	variantPriceGross,
	variantImages,
	product,
}: QuickAddButtonProps) {
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const [pending, startPending] = useTransition();

	const handleClick = () => {
		trackAddToCart({ id: variantId, sku: variantSku, price: variantPrice }, product.name, 1);

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

		startPending(() => {
			startMutation(async () => {
				const result = await addToCart(variantId, 1);
				const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
				if (result.success && result.cart && line) {
					syncCart(result.cart);
					toast.success("Added to cart", {
						description: product.name,
						action: { label: "View cart", onClick: openCart },
					});
				} else {
					await reconcile();
					toast.error("This item is out of stock");
				}
			});
		});
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label={`Add To Cart, ${product.name}`}
			className="btn-shelf h-9 min-w-0 flex-1 whitespace-nowrap px-1 text-sm"
		>
			{pending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
			Add To Cart
		</button>
	);
}
