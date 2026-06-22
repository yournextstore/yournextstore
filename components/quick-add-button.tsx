"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ShoppingBag } from "lucide-react";
import { useTransition } from "react";
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

			await addToCart(variantId, 1);
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
						className="absolute bottom-3 right-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-forest text-cream shadow-lg transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-leaf hover:scale-110 active:scale-95 disabled:opacity-50"
						aria-label={`Add ${product.name} to cart`}
					>
						<ShoppingBag className={`h-4 w-4 ${isPending ? "animate-pulse" : ""}`} strokeWidth={2.4} />
					</button>
				</TooltipTrigger>
				<TooltipContent side="top" className="text-xs">
					Add to cart
				</TooltipContent>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	);
}
