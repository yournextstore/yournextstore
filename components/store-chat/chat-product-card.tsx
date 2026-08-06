"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { YnsLink } from "@/components/yns-link";
import { formatMoney } from "@/lib/money";

export type ChatProduct = {
	productId: string;
	name: string;
	slug: string;
	summary: string | null;
	currency: string;
	imageUrl: string | null;
	variants: Array<{
		id: string;
		label: string;
		price: number;
		inStock: boolean;
		imageUrl: string | null;
	}>;
};

/** Fire-and-forget analytics beacon to the platform chat route. */
const reportEvent = (payload: {
	messageId: string;
	type: "card_click" | "add_to_cart";
	productId: string;
	variantId?: string;
}) => {
	void fetch("/api/chat/events", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(payload),
		keepalive: true,
	}).catch(() => undefined);
};

export function ChatProductCard({
	product,
	messageId,
	locale,
}: {
	product: ChatProduct;
	messageId: string;
	locale: string;
}) {
	const { openCart, dispatch, syncCart, reconcile } = useCart();
	const [selectedVariantId, setSelectedVariantId] = useState(
		product.variants.find((variant) => variant.inStock)?.id ?? product.variants[0]?.id,
	);
	const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);

	const handleAddToCart = () => {
		if (!selectedVariant) return;
		reportEvent({
			messageId,
			type: "add_to_cart",
			productId: product.productId,
			variantId: selectedVariant.id,
		});

		openCart();
		// Same optimistic flow as QuickAddButton: instant local item, then replace
		// with the server cart (no refetch — the layout cartGet reads a stale replica).
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
				productVariant: {
					id: selectedVariant.id,
					price: String(selectedVariant.price),
					images: selectedVariant.imageUrl ? [selectedVariant.imageUrl] : [],
					product: {
						id: product.productId,
						name: product.name,
						slug: product.slug,
						images: product.imageUrl ? [product.imageUrl] : [],
					},
				},
			},
		});

		void (async () => {
			const result = await addToCart(selectedVariant.id, 1);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === selectedVariant.id);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		})();
	};

	return (
		<div className="w-44 shrink-0 snap-start overflow-hidden rounded-xl border bg-background">
			<YnsLink
				href={`/product/${product.slug}`}
				onClick={() => reportEvent({ messageId, type: "card_click", productId: product.productId })}
			>
				<div className="relative aspect-square bg-muted/40">
					{product.imageUrl ? (
						<Image src={product.imageUrl} alt={product.name} fill sizes="176px" className="object-cover" />
					) : null}
				</div>
			</YnsLink>
			<div className="grid gap-2 p-2.5">
				<YnsLink
					href={`/product/${product.slug}`}
					className="line-clamp-2 text-xs font-medium leading-snug hover:underline"
					onClick={() => reportEvent({ messageId, type: "card_click", productId: product.productId })}
				>
					{product.name}
				</YnsLink>
				{selectedVariant && (
					<div className="text-xs font-semibold tabular-nums">
						{formatMoney({ amount: selectedVariant.price, currency: product.currency, locale })}
					</div>
				)}
				{product.variants.length > 1 && (
					<select
						value={selectedVariantId}
						onChange={(e) => setSelectedVariantId(e.target.value)}
						aria-label={`Choose a variant of ${product.name}`}
						className="w-full rounded-md border bg-background px-1.5 py-1 text-xs"
					>
						{product.variants.map((variant) => (
							<option key={variant.id} value={variant.id} disabled={!variant.inStock}>
								{variant.label}
								{variant.inStock ? "" : " — out of stock"}
							</option>
						))}
					</select>
				)}
				<button
					type="button"
					onClick={handleAddToCart}
					disabled={!selectedVariant?.inStock}
					className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground px-2 py-1.5 text-xs font-medium text-background transition-opacity disabled:opacity-40"
				>
					<ShoppingBag className="h-3 w-3" />
					{selectedVariant?.inStock ? "Add to cart" : "Out of stock"}
				</button>
			</div>
		</div>
	);
}
