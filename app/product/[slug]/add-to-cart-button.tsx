"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";

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
	volumePricingTiers?: VolumeTier[];
	/** Show a "remind me when back in stock" flow when out of stock (Restock Notifications module). */
	restockNotificationsEnabled?: boolean;
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
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

	const unitPrice = volumePrice ?? (selectedVariant ? displayPrice(selectedVariant, taxBehavior) : null);
	const _totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

	const buttonText = useMemo(() => {
		if (!selectedVariant) return "Select options";
		if (isOutOfStock) return "Sold out";
		return "Add to bag";
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;

		trackAddToCart(selectedVariant, product.name, addedQuantity);

		openCart();
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
		<div className="space-y-6">
			{/* Price: the list price struck through first, then the price, as the original sets it. */}
			<div className="space-y-1.5">
				<p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-xl tabular-nums md:text-2xl">
					{priceInfo.compareAt && (
						<span className="text-muted-foreground line-through">
							<span className="sr-only">Was </span>
							{priceInfo.compareAt}
						</span>
					)}
					<span className="text-foreground">{priceInfo.display}</span>
					{priceInfo.discountPercent ? (
						<span className="self-center rounded-md bg-sale px-2 py-1 text-[11px] leading-none font-semibold text-white uppercase">
							{priceInfo.discountPercent}% off
						</span>
					) : null}
				</p>
				{omnibusPrice && (
					<p className="text-xs text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
				)}
				{taxBehavior === "inclusive" && <p className="text-xs text-muted-foreground">Tax included.</p>}
			</div>

			{/* The original's "Hurry up!" line with a meter, only when stock runs low. */}
			{stockStatus?.tone === "low" && selectedVariant?.stock != null && (
				<div>
					<p className="text-[13px]">Hurry up! Only {selectedVariant.stock} left in stock.</p>
					<div className="mt-2 h-0.5 bg-muted">
						<div
							className="h-full bg-foreground"
							style={{ width: `${Math.max(8, (selectedVariant.stock / LOW_STOCK_THRESHOLD) * 60)}%` }}
						/>
					</div>
				</div>
			)}

			{variants.length > 1 && <VariantSelector variants={variants} />}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
			) : (
				<form onSubmit={handleSubmit} className="flex items-stretch gap-3">
					<QuantitySelector
						quantity={effectiveQuantity}
						onQuantityChange={setQuantity}
						max={Math.max(1, Math.min(99, maxQuantity))}
						disabled={isOutOfStock}
					/>
					<button
						type="submit"
						disabled={!selectedVariant || isOutOfStock}
						className="inline-flex h-12 min-w-0 flex-1 items-center justify-center rounded-xs bg-primary px-6 text-[13px] font-medium tracking-[0.02em] text-primary-foreground uppercase transition-colors hover:bg-[#6d6966] disabled:cursor-not-allowed disabled:opacity-60"
					>
						{buttonText}
					</button>
				</form>
			)}

			{stockStatus?.tone === "out" && (
				<p className="text-[13px] text-destructive">This piece is sold out for now.</p>
			)}
			{selectedVariant?.sku && <p className="text-xs text-muted-foreground">SKU {selectedVariant.sku}</p>}
		</div>
	);
}
