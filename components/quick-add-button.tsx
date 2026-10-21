"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";

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
	className?: string;
};

/** Full-width gold "Add to cart" under a product card, as in the original. */
export function QuickAddButton({
	variantId,
	variantSku,
	variantPrice,
	variantPriceGross,
	variantImages,
	product,
	className,
}: QuickAddButtonProps) {
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();

	const handleClick = () => {
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
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85 active:scale-[0.99]",
				className,
			)}
			aria-label={`Add to cart, ${product.name}`}
		>
			<Plus aria-hidden="true" className="size-4" />
			Add to cart
		</button>
	);
}
