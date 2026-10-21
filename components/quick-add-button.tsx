"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { CartPlusIcon } from "@/components/gf/icons";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
		<TooltipPrimitive.Provider delayDuration={1000}>
			<TooltipPrimitive.Root>
				<TooltipTrigger asChild>
					<button
						type="button"
						onClick={handleClick}
						className="relative z-10 flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white transition-[background-color,transform] hover:bg-green-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 before:absolute before:-inset-[5px]"
						aria-label={`Add to cart, ${product.name}`}
					>
						<CartPlusIcon />
					</button>
				</TooltipTrigger>
				<TooltipContent side="top" className="text-xs">
					Add to cart
				</TooltipContent>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	);
}
