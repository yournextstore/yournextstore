"use client";

import { Plus, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";

export type QuickAddVariant = {
	id: string;
	sku?: string | null;
	price: string;
	/** Gross twin of `price`, so the optimistic cart line matches the store's tax behaviour. */
	priceGross?: string | null;
	images: string[];
};

export type QuickAddProduct = {
	id: string;
	name: string;
	slug: string;
	images: string[];
};

function useQuickAdd() {
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();

	return (variant: QuickAddVariant, product: QuickAddProduct) => {
		trackAddToCart({ id: variant.id, sku: variant.sku ?? null, price: variant.price }, product.name, 1);

		openCart();

		// Instant local feedback OUTSIDE the transition, then REPLACE with the
		// server-returned cart (never refetch — cartGet reads a replica that can lag the
		// write). The transition keeps Checkout disabled until the write lands.
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
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
			// The server clamps to available stock and still returns the cart — surface
			// the failure instead of letting the optimistic item silently vanish.
			const result = await addToCart(variant.id, 1);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variant.id);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};
}

/** The original card's navy "ADD TO CART" bar with the basket glyph. */
export function QuickAddButton({
	variant,
	product,
	className,
}: {
	variant: QuickAddVariant;
	product: QuickAddProduct;
	className?: string;
}) {
	const add = useQuickAdd();
	return (
		<button
			type="button"
			onClick={() => add(variant, product)}
			aria-label={`Add to cart, ${product.name}`}
			className={cn(
				"inline-flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-main px-4 text-sm font-medium uppercase tracking-wide text-page transition-colors hover:bg-main-hover active:scale-[0.98]",
				className,
			)}
		>
			<ShoppingBasket className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
			Add to cart
		</button>
	);
}

/** Compact "+" used by the cart drawer's "You may also like" rows. */
export function QuickAddIconButton({
	variant,
	product,
}: {
	variant: QuickAddVariant;
	product: QuickAddProduct;
}) {
	const add = useQuickAdd();
	return (
		<button
			type="button"
			onClick={() => add(variant, product)}
			aria-label={`Add to cart, ${product.name}`}
			className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-main text-main transition-colors hover:bg-main hover:text-page"
		>
			<Plus className="h-4 w-4" aria-hidden="true" />
		</button>
	);
}
