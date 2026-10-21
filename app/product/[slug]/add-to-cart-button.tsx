"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { useStoreConfig } from "@/components/store-config-provider";
import { chipToneClass, productChips } from "@/lib/display";
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
	summary?: string | null;
	volumePricingTiers?: VolumeTier[];
	/** Show a "remind me when back in stock" flow when out of stock (Restock Notifications module). */
	restockNotificationsEnabled?: boolean;
	/** The product's room, printed as the lavender chip. */
	category?: { name: string } | null;
};

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	category = null,
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const quantity = 1;
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

	const buttonText = useMemo(() => {
		if (!selectedVariant) return "Select options";
		if (isOutOfStock) return "Out of stock";
		return "Add to Basket";
	}, [selectedVariant, isOutOfStock]);

	// Headline price. For the selected variant we show its own price (and the struck-through
	// list price when it's on sale). Before a variant is picked we fall back to a range.
	const priceInfo = useMemo(() => {
		const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

		if (selectedVariant) {
			const price = BigInt(displayPrice(selectedVariant, taxBehavior));
			const listPrice = BigInt(
				displayPrice(selectedVariant, taxBehavior, "originalPrice") ??
					displayPrice(selectedVariant, taxBehavior),
			);
			const onSale = listPrice > price;
			return {
				display: fmt(price),
				compareAt: onSale ? fmt(listPrice) : null,
				discountPercent: onSale ? Math.round((Number(listPrice - price) / Number(listPrice)) * 100) : null,
			};
		}

		const { min: minPrice, max: maxPrice } = priceRange(variants, taxBehavior);
		return {
			display: minPrice === maxPrice ? fmt(minPrice) : `${fmt(minPrice)} - ${fmt(maxPrice)}`,
			compareAt: null,
			discountPercent: null,
		};
	}, [selectedVariant, variants, locale, currency, taxBehavior]);

	// EU Omnibus: when the variant is discounted, show the lowest price recorded in the last 30 days.
	const omnibusPrice = useMemo(() => {
		if (!selectedVariant || !priceInfo.compareAt) return null;
		const lowest = displayPrice(selectedVariant, taxBehavior, "omnibusPrice");
		if (!lowest) return null;
		return formatMoney({ amount: BigInt(lowest), currency, locale });
	}, [selectedVariant, priceInfo.compareAt, locale, currency, taxBehavior]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;

		trackAddToCart(selectedVariant, product.name, addedQuantity);

		openCart();

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
				if (line.quantity < previousQuantity + addedQuantity) {
					toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
				}
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	const chips = productChips({
		category,
		variants: selectedVariant ? [selectedVariant] : variants.slice(0, 1),
	});
	const stockLabel =
		selectedVariant?.stock === null || selectedVariant?.stock === undefined
			? "in stock"
			: selectedVariant.stock > 20
				? "in stock: 20+"
				: `in stock: ${selectedVariant.stock}`;

	return (
		<div>
			{chips.length > 0 && (
				<ul className="mt-3 flex flex-wrap gap-1">
					{chips.map((chip) => (
						<li key={chip.label} className={cn("rounded-xs px-2 py-1 text-sm", chipToneClass[chip.tone])}>
							{chip.label}
						</li>
					))}
				</ul>
			)}
			{summary && <p className="mt-4 leading-relaxed whitespace-pre-line text-muted-foreground">{summary}</p>}

			<div className="mt-5 border-t border-border pt-6">
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span
						className={cn(
							"text-[32px] leading-tight font-bold",
							priceInfo.compareAt ? "text-sale" : "text-muted-foreground",
						)}
					>
						{priceInfo.display}
					</span>
					{priceInfo.compareAt && (
						<s className="text-base font-medium text-muted-foreground">{priceInfo.compareAt}</s>
					)}
					{priceInfo.discountPercent ? (
						<span className="rounded-xs bg-sale px-2.5 py-1 text-sm font-bold text-white">
							-{priceInfo.discountPercent}%
						</span>
					) : null}
				</div>
				{omnibusPrice && (
					<p className="mt-1 text-xs text-muted-foreground">
						Lowest price in the last 30 days: {omnibusPrice}
					</p>
				)}

				{variants.length > 1 && (
					<div className="mt-6">
						<VariantSelector variants={variants} />
					</div>
				)}

				<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

				{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
					<div className="mt-5">
						<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
					</div>
				) : (
					<form onSubmit={handleSubmit} className="mt-5">
						<button
							type="submit"
							disabled={!selectedVariant || isOutOfStock}
							className="h-12 w-full rounded-xs bg-peach px-8 text-base font-bold text-foreground transition-colors hover:bg-pink disabled:cursor-not-allowed disabled:opacity-60 sm:w-[250px]"
						>
							{buttonText}
						</button>
					</form>
				)}
			</div>

			<div className="mt-4 border-t border-border pt-4 text-base text-muted-foreground">
				<p className="font-bold">Online</p>
				{selectedVariant ? (
					<p className="mt-0.5 flex items-center gap-2">
						<span
							aria-hidden="true"
							className={cn("size-2.5 rounded-full", isOutOfStock ? "bg-sale" : "bg-stock")}
						/>
						{isOutOfStock ? "out of stock" : stockLabel}
					</p>
				) : (
					<p className="mt-0.5">Choose an option to see availability</p>
				)}
			</div>
		</div>
	);
}
