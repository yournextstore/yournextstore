"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ShoppingBag } from "lucide-react";
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
						className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md bg-[color:var(--ink)] text-cream transition-colors hover:bg-[color:var(--oxblood)] active:scale-95 disabled:opacity-50"
						aria-label={`Add ${product.name} to cart`}
					>
						<ShoppingBag className={`h-4 w-4 stroke-[1.5] ${isPending ? "animate-pulse" : ""}`} />
					</button>
				</TooltipTrigger>
				<TooltipContent side="top" className="text-xs">
					Add to cart
				</TooltipContent>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	);
}
