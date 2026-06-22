"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Plus } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type QuickAddButtonProps = {
	variantId: string;
	variantPrice: string;
	variantImages: string[];
	product: {
		id: string;
		name: string;
		slug: string;
		images: string[];
	};
};

export function QuickAddButton({ variantId, variantPrice, variantImages, product }: QuickAddButtonProps) {
	const [isPending, startTransition] = useTransition();
	const { openCart, dispatch } = useCart();

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		openCart();

		startTransition(async () => {
			dispatch({
				type: "ADD_ITEM",
				item: {
					quantity: 1,
					productVariant: {
						id: variantId,
						price: variantPrice,
						images: variantImages,
						product,
					},
				},
			});

			// The server clamps to available stock and still returns the cart — surface
			// the failure instead of letting the optimistic item silently vanish.
			const result = await addToCart(variantId, 1);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
			if (!result.success || !line) {
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
						disabled={isPending}
						className="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center neo-border bg-[var(--color-surface-container-lowest)] transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] active:translate-y-px disabled:opacity-50"
						aria-label={`Add ${product.name} to cart`}
					>
						<Plus className={`h-4 w-4 ${isPending ? "animate-pulse" : ""}`} />
					</button>
				</TooltipTrigger>
				<TooltipContent side="top" className="text-xs">
					Add to cart
				</TooltipContent>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	);
}
