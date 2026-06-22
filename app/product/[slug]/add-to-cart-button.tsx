"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { TrustBadges } from "@/app/product/[slug]/trust-badges";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

type Variant = {
	id: string;
	price: string;
	originalPrice: string;
	sku: string | null;
	images: string[];
	stock: number | null;
	/** EU Omnibus: lowest price in the last 30 days (null unless the store enables omnibus). */
	omnibusPrice: string | null;
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
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
}: AddToCartButtonProps) {
	const searchParams = useSearchParams();
	const isPreviewMode = searchParams.get("preview") === "1";
	const [quantity, setQuantity] = useState(1);
	const { items, openCart, dispatch, startMutation } = useCart();

	const selectedVariant = useMemo(() => {
		if (variants.length === 1) {
			return variants[0];
		}

		if (searchParams.size === 0) {
			return undefined;
		}

		const paramsOptions: Record<string, string> = {};
		searchParams.forEach((valueName, key) => {
			paramsOptions[key] = valueName;
		});

		return variants.find((variant) =>
			variant.combinations.every(
				(combination) =>
					paramsOptions[combination.variantValue.variantType.label] === combination.variantValue.value,
			),
		);
	}, [variants, searchParams]);

	// stock === null means stock isn't tracked for this variant (unlimited)
	const isOutOfStock = selectedVariant?.stock === 0;
	const maxQuantity = selectedVariant?.stock ?? 99;
	const effectiveQuantity = isOutOfStock ? 1 : Math.min(quantity, maxQuantity);

	const { resolvedTiers, volumePrice } = useVolumePricing(
		volumePricingTiers,
		selectedVariant?.id,
		effectiveQuantity,
	);

	const unitPrice = volumePrice ?? selectedVariant?.price;
	const totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

	const buttonText = useMemo(() => {
		if (!selectedVariant) return "Select options";
		if (isOutOfStock) return "Out of stock";
		if (totalPrice) {
			return `Add to Cart — ${formatMoney({ amount: totalPrice, currency: CURRENCY, locale: LOCALE })}`;
		}
		return "Add to Cart";
	}, [selectedVariant, isOutOfStock, totalPrice]);

	// Headline price. For the selected variant we show its own price (and the struck-through
	// list price when it's on sale). Before a variant is picked we fall back to a range.
	const priceInfo = useMemo(() => {
		const fmt = (amount: bigint) => formatMoney({ amount, currency: CURRENCY, locale: LOCALE });

		if (selectedVariant) {
			const price = BigInt(selectedVariant.price);
			const listPrice = BigInt(selectedVariant.originalPrice);
			const onSale = listPrice > price;
			return {
				display: fmt(price),
				compareAt: onSale ? fmt(listPrice) : null,
				discountPercent: onSale ? Math.round((Number(listPrice - price) / Number(listPrice)) * 100) : null,
			};
		}

		const prices = variants.map((v) => BigInt(v.price));
		const minPrice = prices.reduce((min, p) => (p < min ? p : min), prices[0] ?? BigInt(0));
		const maxPrice = prices.reduce((max, p) => (p > max ? p : max), prices[0] ?? BigInt(0));
		return {
			display: minPrice === maxPrice ? fmt(minPrice) : `${fmt(minPrice)} - ${fmt(maxPrice)}`,
			compareAt: null,
			discountPercent: null,
		};
	}, [selectedVariant, variants]);

	// EU Omnibus: when the variant is discounted, show the lowest price recorded in the last 30 days.
	const omnibusPrice = useMemo(() => {
		if (!selectedVariant || !priceInfo.compareAt) return null;
		const lowest = selectedVariant.omnibusPrice;
		if (!lowest) return null;
		return formatMoney({ amount: BigInt(lowest), currency: CURRENCY, locale: LOCALE });
	}, [selectedVariant, priceInfo.compareAt]);

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

		openCart();
		setQuantity(1);

		startMutation(async () => {
			dispatch({
				type: "ADD_ITEM",
				item: {
					quantity: addedQuantity,
					productVariant: {
						id: variantId,
						price: selectedVariant.price,
						images: selectedVariant.images,
						product,
					},
				},
			});

			// The server clamps line quantities to available stock and still responds
			// with the updated cart — compare against what we asked for so the
			// optimistic item doesn't silently vanish on revert.
			const result = await addToCart(variantId, addedQuantity, isPreviewMode);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
			if (!result.success || !line) {
				toast.error("This item is out of stock");
			} else if (line.quantity < previousQuantity + addedQuantity) {
				toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
			}
		});
	};

	return (
		<div className="space-y-8">
			{summary && <p className="text-muted-foreground leading-relaxed">{summary}</p>}

			{/* Price & sale */}
			<div className="space-y-2">
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span className="text-3xl font-semibold tracking-tight">{priceInfo.display}</span>
					{priceInfo.compareAt && (
						<span className="text-lg text-muted-foreground line-through">{priceInfo.compareAt}</span>
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

				{/* SKU & stock availability */}
				{(selectedVariant?.sku || stockStatus) && (
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
						{stockStatus && (
							<span
								className={cn(
									"inline-flex items-center gap-1.5 font-medium",
									stockStatus.tone === "out" && "text-destructive",
									stockStatus.tone === "low" && "text-amber-600 dark:text-amber-500",
									stockStatus.tone === "in" && "text-green-600 dark:text-green-500",
								)}
							>
								<span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
								{stockStatus.label}
							</span>
						)}
						{selectedVariant?.sku && (
							<span className="text-muted-foreground">
								SKU: <span className="font-medium text-foreground">{selectedVariant.sku}</span>
							</span>
						)}
					</div>
				)}
			</div>

			{variants.length > 1 && <VariantSelector variants={variants} selectedVariantId={selectedVariant?.id} />}

			<QuantitySelector
				quantity={effectiveQuantity}
				onQuantityChange={setQuantity}
				max={Math.max(1, Math.min(99, maxQuantity))}
				disabled={isOutOfStock}
			/>

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			<form onSubmit={handleSubmit}>
				<button
					type="submit"
					disabled={!selectedVariant || isOutOfStock}
					className="w-full h-14 bg-foreground text-primary-foreground py-4 px-8 rounded-full text-base font-medium tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{buttonText}
				</button>
			</form>

			<TrustBadges />
		</div>
	);
}
