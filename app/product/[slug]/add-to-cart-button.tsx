"use client";

import { type ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { TrustBadges } from "@/app/product/[slug]/trust-badges";
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
	summary?: string | null;
	volumePricingTiers?: VolumeTier[];
	/** Show a "remind me when back in stock" flow when out of stock (Restock Notifications module). */
	restockNotificationsEnabled?: boolean;
	/** Reviews summary shown after the price ("/ ★ 4.8 · 12 reviews"). */
	rating?: ReactNode;
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	rating,
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
	const totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

	const buttonText = useMemo(() => {
		if (!selectedVariant) return "Select options";
		if (isOutOfStock) return "Out of stock";
		return "Add to cart";
	}, [selectedVariant, isOutOfStock]);
	const totalLabel = totalPrice ? formatMoney({ amount: totalPrice, currency, locale }) : null;

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
		<div className="space-y-8">
			{/* Price & sale */}
			<div className="space-y-2">
				<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-lg">
					<span className="tabular-nums">{priceInfo.display}</span>
					{priceInfo.compareAt && (
						<span className="text-base text-muted-foreground line-through">{priceInfo.compareAt}</span>
					)}
					{priceInfo.discountPercent ? (
						<span className="rounded bg-sale px-1.5 py-0.5 text-xs leading-none text-sale-foreground">
							Sale −{priceInfo.discountPercent}%
						</span>
					) : null}
					{rating && (
						<>
							<span aria-hidden="true" className="text-border">
								/
							</span>
							{rating}
						</>
					)}
				</div>

				{omnibusPrice && (
					<p className="text-xs text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
				)}
			</div>

			{summary && <p className="max-w-xl text-base/7 whitespace-pre-line">{summary}</p>}

			{variants.length > 1 && <VariantSelector variants={variants} />}

			<QuantitySelector
				quantity={effectiveQuantity}
				onQuantityChange={setQuantity}
				max={Math.max(1, Math.min(99, maxQuantity))}
				disabled={isOutOfStock}
			/>

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
			) : (
				<form onSubmit={handleSubmit} className="space-y-3">
					<button
						type="submit"
						disabled={!selectedVariant || isOutOfStock}
						className="relative flex h-16 w-full items-center justify-center rounded-full bg-primary px-20 text-sm uppercase text-primary-foreground transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
					>
						{buttonText}
						<span
							aria-hidden="true"
							className="absolute top-1/2 right-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15"
						>
							<svg
								aria-hidden="true"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								className="h-5 w-5"
							>
								<path
									d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
					</button>
					{(stockStatus || totalLabel) && (
						<div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs uppercase">
							{stockStatus && (
								<span
									className={cn(
										stockStatus.tone === "out" && "text-destructive",
										stockStatus.tone === "low" && "text-amber-700",
										stockStatus.tone === "in" && "text-stock",
									)}
								>
									{stockStatus.label}
								</span>
							)}
							{totalLabel && effectiveQuantity > 1 && (
								<span className="text-muted-foreground">Total {totalLabel}</span>
							)}
						</div>
					)}
				</form>
			)}

			<TrustBadges />
		</div>
	);
}
