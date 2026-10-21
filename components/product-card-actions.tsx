"use client";

import { Loader2, Plus, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";

const pill =
	"inline-flex h-8 w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-input bg-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50";

type CardAddButtonProps = {
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

/** The original card's outline "Add to cart" pill, for single-variant products. */
export function CardAddButton({
	variantId,
	variantSku,
	variantPrice,
	variantPriceGross,
	variantImages,
	product,
}: CardAddButtonProps) {
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const [pending, setPending] = useState(false);

	const handleClick = () => {
		trackAddToCart({ id: variantId, sku: variantSku, price: variantPrice }, product.name, 1);
		openCart();
		setPending(true);
		// Instant local feedback, then replace with the server-returned cart (never refetch).
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
			const result = await addToCart(variantId, 1);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
			setPending(false);
		});
	};

	return (
		<button type="button" onClick={handleClick} className={pill} aria-label={`Add to cart, ${product.name}`}>
			{pending ? (
				<Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
			) : (
				<Plus aria-hidden="true" className="size-3.5" />
			)}
			Add to cart
		</button>
	);
}

export const cardPillClass = pill;

/** The original's share button: the native share sheet where there is one, else the link is copied. */
export function CardShareButton({
	name,
	path,
	className,
}: {
	name: string;
	path: string;
	className?: string;
}) {
	const handleClick = async () => {
		const url = new URL(path, window.location.origin).toString();
		if (typeof navigator.share === "function") {
			try {
				await navigator.share({ title: name, url });
				return;
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") return;
			}
		}
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Link copied");
		} catch {
			toast.error("Could not copy the link");
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label={`Share ${name}`}
			className={cn(
				"inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-input bg-transparent shadow-sm transition-all duration-200 ease-in-out hover:scale-110 hover:bg-accent",
				className,
			)}
		>
			<Share2 aria-hidden="true" className="size-3.5" />
		</button>
	);
}
