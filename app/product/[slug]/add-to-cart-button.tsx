"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { SplitPrice } from "@/components/split-price";
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

	const buttonText = useMemo(() => {
		if (!selectedVariant) return "Select options";
		if (isOutOfStock) return "Out of stock";
		return "Add to cart";
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

	const selectedAttributes = selectedVariant?.combinations.map((c) => ({
		label: c.variantValue.variantType.label,
		value: c.variantValue.value,
	}));

	return (
		<>
			{/* Middle column: options and the price pill, under the title. */}
			<div className="space-y-6 lg:col-start-2 lg:row-start-2">
				{variants.length > 1 && <VariantSelector variants={variants} />}
				<div className="flex flex-wrap items-center gap-3">
					<span className="rounded-full bg-secondary px-4 py-2">
						<SplitPrice value={priceInfo.display} className="text-xl" />
					</span>
					{priceInfo.compareAt && (
						<span className="text-base text-muted-foreground line-through">{priceInfo.compareAt}</span>
					)}
					{priceInfo.discountPercent ? (
						<span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
							Save {priceInfo.discountPercent}%
						</span>
					) : null}
				</div>
				{omnibusPrice && (
					<p className="text-xs text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
				)}
			</div>

			{/* Right column: the original's buy box. */}
			<div className="lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:self-start">
				<div className="space-y-4 rounded-lg border border-border bg-card p-5">
					<dl className="space-y-3 text-sm">
						<div className="flex items-center justify-between gap-4">
							<dt className="text-muted-foreground">Price</dt>
							<dd>
								<SplitPrice value={priceInfo.display} className="text-lg" />
							</dd>
						</div>
						{selectedAttributes?.map((attribute) => (
							<div key={attribute.label} className="flex items-center justify-between gap-4">
								<dt className="text-muted-foreground">{attribute.label}</dt>
								<dd className="font-medium text-foreground">{attribute.value}</dd>
							</div>
						))}
						{stockStatus && (
							<div className="flex items-center justify-between gap-4">
								<dt className="text-muted-foreground">Status</dt>
								<dd
									className={cn(
										"rounded-full border px-2.5 py-0.5 text-xs font-semibold",
										stockStatus.tone === "out" && "border-destructive/40 text-destructive",
										stockStatus.tone === "low" && "border-accent text-gold-ink",
										stockStatus.tone === "in" && "border-border text-foreground",
									)}
								>
									{stockStatus.label}
								</dd>
							</div>
						)}
						{selectedVariant?.sku && (
							<div className="flex items-center justify-between gap-4">
								<dt className="text-muted-foreground">SKU</dt>
								<dd className="font-medium text-foreground">{selectedVariant.sku}</dd>
							</div>
						)}
					</dl>

					{!isOutOfStock && (
						<QuantitySelector
							quantity={effectiveQuantity}
							onQuantityChange={setQuantity}
							max={Math.max(1, Math.min(99, maxQuantity))}
							disabled={isOutOfStock}
						/>
					)}

					<VolumePricingDisplay
						tiers={resolvedTiers}
						quantity={effectiveQuantity}
						volumePrice={volumePrice}
					/>

					{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
						<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
					) : (
						<form onSubmit={handleSubmit}>
							<button
								type="submit"
								disabled={!selectedVariant || isOutOfStock}
								className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/85 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{selectedVariant && !isOutOfStock && <Plus aria-hidden="true" className="size-4" />}
								{buttonText}
							</button>
						</form>
					)}
				</div>
			</div>
		</>
	);
}
