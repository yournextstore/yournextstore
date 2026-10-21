"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";

// Every net price below has a gross twin; which of the pair a shopper sees is the store's
// `taxBehavior` (see lib/pricing.ts). The twins stay optional so this still renders against
// an older API payload that sends the net values only.
type Variant = {
	id: string;
	price: string;
	priceGross?: string;
	originalPrice: string;
	originalPriceGross?: string | null;
	sku: string | null;
	images: string[];
	stock: number | null;
	/** EU Omnibus: lowest price in the last 30 days (null unless the store enables omnibus). */
	omnibusPrice: string | null;
	omnibusPriceGross?: string | null;
	combinations: {
		variantValue: {
			id: string;
			value: string;
			colorValue: string | null;
			variantType: {
				id: string;
				type: "string" | "color";
				label: string;
			};
		};
	}[];
};

type AddToCartButtonProps = {
	variants: Variant[];
	product: {
		id: string;
		name: string;
		slug: string;
		images: string[];
	};
	summary?: string[];
	volumePricingTiers?: VolumeTier[];
	/** Show a "remind me when back in stock" flow when out of stock (Restock Notifications module). */
	restockNotificationsEnabled?: boolean;
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
}: AddToCartButtonProps) {
	const { taxBehavior, language } = useStoreConfig();
	const [quantity, setQuantity] = useState(1);
	const { items, openCart, dispatch, syncCart, reconcile, startMutation } = useCart();

	const selectedVariant = useSelectedVariant(variants);

	// stock === null means stock isn't tracked for this variant (unlimited)
	const isOutOfStock = selectedVariant?.stock === 0;
	const maxQuantity = selectedVariant?.stock ?? 99;
	const effectiveQuantity = isOutOfStock ? 1 : Math.min(quantity, maxQuantity);

	const { resolvedTiers, volumePrice } = useVolumePricing(
		volumePricingTiers,
		selectedVariant?.id,
		effectiveQuantity,
		taxBehavior,
	);

	const buttonText = !selectedVariant ? "Select options" : isOutOfStock ? "Out of stock" : "Add to cart";

	// Stock availability. null stock means it isn't tracked (treated as in stock).
	const stockStatus = useMemo(() => {
		if (!selectedVariant) return null;
		const { stock } = selectedVariant;
		if (stock === 0) return { label: "Out of stock", tone: "out" as const };
		if (stock !== null && stock <= LOW_STOCK_THRESHOLD) {
			return { label: `Only ${stock} left in stock`, tone: "low" as const };
		}
		return { label: "In stock", tone: "in" as const };
	}, [selectedVariant]);

	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// "Buy now" adds the piece, then goes straight to the hosted checkout once the cart has it.
		const submitter = (e.nativeEvent as SubmitEvent).submitter;
		const buyNow = submitter instanceof HTMLButtonElement && submitter.value === "buy";

		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;

		trackAddToCart(selectedVariant, product.name, addedQuantity);

		if (!buyNow) openCart();
		setQuantity(1);

		// Instant local feedback OUTSIDE the transition, then REPLACE with the
		// server-returned cart (never refetch — cartGet reads a replica that can lag
		// the write).
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: addedQuantity,
				productVariant: {
					id: variantId,
					price: selectedVariant.price,
					// Carry the gross twin so the optimistic line renders in the same basis the
					// server-returned cart will use — no net/gross flip while the write is in flight.
					priceGross: selectedVariant.priceGross,
					images: selectedVariant.images,
					product,
				},
			},
		});

		startMutation(async () => {
			// The server clamps line quantities to available stock and still responds
			// with the updated cart — sync from the RETURNED cart; reconcile only on failure.
			const result = await addToCart(variantId, addedQuantity);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
				if (buyNow) {
					// Plain navigation: /checkout is a proxied zone (see AGENTS.md).
					window.location.assign(checkoutUrl);
					return;
				}
				if (line.quantity < previousQuantity + addedQuantity) {
					toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
				}
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="flex flex-col gap-8">
			{variants.length > 1 && <VariantSelector variants={variants} />}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			<ProductPrice variants={variants} />

			{stockStatus && stockStatus.tone !== "in" && (
				<p
					className={cn(
						"-mt-5 text-sm font-medium",
						stockStatus.tone === "out" ? "text-destructive" : "text-[#9a5b00]",
					)}
				>
					{stockStatus.label}
				</p>
			)}

			{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
			) : (
				<form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
					<button
						type="submit"
						value="add"
						disabled={!selectedVariant || isOutOfStock}
						className="ds-btn ds-btn-wide w-full"
					>
						<span className="truncate">{buttonText}</span>
					</button>
					<button
						type="submit"
						value="buy"
						disabled={!selectedVariant || isOutOfStock}
						className="ds-btn ds-btn-wide ds-btn-grey w-full"
					>
						Buy now
					</button>
				</form>
			)}

			{summary && summary.length > 0 && (
				<div className="flex flex-col gap-3 text-sm leading-6">
					{summary.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>
			)}
		</div>
	);
}

/** Headline price under the product title; follows the selected variant like the panel does. */
export function ProductPrice({ variants }: { variants: Variant[] }) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const selectedVariant = useSelectedVariant(variants);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const priceInfo = (() => {
		if (selectedVariant) {
			const price = BigInt(displayPrice(selectedVariant, taxBehavior));
			const listPrice = BigInt(
				displayPrice(selectedVariant, taxBehavior, "originalPrice") ??
					displayPrice(selectedVariant, taxBehavior),
			);
			return { display: fmt(price), compareAt: listPrice > price ? fmt(listPrice) : null };
		}
		const { min: minPrice, max: maxPrice } = priceRange(variants, taxBehavior);
		return {
			display: minPrice === maxPrice ? fmt(minPrice) : `${fmt(minPrice)} – ${fmt(maxPrice)}`,
			compareAt: null,
		};
	})();

	// EU Omnibus: when the variant is discounted, show the lowest price recorded in the last 30 days.
	const lowest =
		selectedVariant && priceInfo.compareAt
			? displayPrice(selectedVariant, taxBehavior, "omnibusPrice")
			: null;

	return (
		<div className="min-h-[4.25rem]">
			<p className="flex flex-wrap items-baseline justify-center gap-x-3 md:justify-start">
				<span className="text-2xl font-bold text-gray-800">{priceInfo.display}</span>
				{priceInfo.compareAt && (
					<span className="text-base text-sale line-through">{priceInfo.compareAt}</span>
				)}
			</p>
			<p className="mt-1 text-sm text-muted-foreground">
				{taxBehavior === "inclusive" ? "including tax plus shipping" : "plus tax and shipping"}
			</p>
			{lowest && (
				<p className="mt-1 text-xs text-muted-foreground">
					Lowest price in the last 30 days: {fmt(BigInt(lowest))}
				</p>
			)}
		</div>
	);
}
