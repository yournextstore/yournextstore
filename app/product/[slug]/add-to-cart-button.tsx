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
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior, language } = useStoreConfig();
	const [quantity, setQuantity] = useState(1);
	const [showAll, setShowAll] = useState(false);
	const longSummary = (summary?.length ?? 0) > 320;
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
		if (totalPrice) {
			return `Add to bag, ${formatMoney({ amount: totalPrice, currency, locale })}`;
		}
		return "Add to bag";
	}, [selectedVariant, isOutOfStock, totalPrice, locale, currency]);

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

	// "Buy now" adds the line, then leaves for the hosted checkout once the write has landed.
	// A full navigation on purpose: /checkout is a proxied zone (see AGENTS.md).
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const submitter = (e.nativeEvent as SubmitEvent).submitter;
		const buyNow = submitter instanceof HTMLButtonElement && submitter.value === "buy-now";

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
				if (line.quantity < previousQuantity + addedQuantity) {
					toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
				}
				if (buyNow) window.location.assign(checkoutUrl);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="space-y-7">
			<div className="space-y-2">
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<strong className="mono text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-none tabular-nums">
						{priceInfo.display}
					</strong>
					{priceInfo.compareAt && <del className="mono text-[0.9rem] text-faint">{priceInfo.compareAt}</del>}
					{priceInfo.discountPercent ? (
						<span className="chip chip-soon">save {priceInfo.discountPercent}%</span>
					) : null}
				</div>
				{omnibusPrice && (
					<p className="text-xs text-faint">Lowest price in the last 30 days: {omnibusPrice}</p>
				)}
			</div>

			{summary && (
				<div className="max-w-[56ch]">
					<p
						id="product-summary"
						className={cn(
							"whitespace-pre-line text-[1.04rem] text-dim",
							longSummary && !showAll && "line-clamp-5",
						)}
					>
						{summary}
					</p>
					{longSummary && (
						<button
							type="button"
							onClick={() => setShowAll((open) => !open)}
							aria-expanded={showAll}
							aria-controls="product-summary"
							className="label-mono mt-2 text-denim-deep underline underline-offset-4 hover:text-ink"
						>
							{showAll ? "Read less" : "Read the whole note"}
						</button>
					)}
				</div>
			)}

			{variants.length > 1 && <VariantSelector variants={variants} />}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
			) : (
				<form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
					<QuantitySelector
						quantity={effectiveQuantity}
						onQuantityChange={setQuantity}
						max={Math.max(1, Math.min(99, maxQuantity))}
						disabled={isOutOfStock}
					/>
					<button
						type="submit"
						value="add"
						disabled={!selectedVariant || isOutOfStock}
						aria-label={totalPrice && !isOutOfStock ? `${buttonText}` : undefined}
						className="btn min-w-40 flex-1 [--btn-py:14px]"
					>
						{selectedVariant && !isOutOfStock ? "Add to bag" : buttonText}
					</button>
					<button
						type="submit"
						value="buy-now"
						disabled={!selectedVariant || isOutOfStock}
						className="btn btn-ghost min-w-40 flex-1 basis-full [--btn-py:14px] sm:basis-0"
					>
						Buy now <span aria-hidden="true">→</span>
					</button>
				</form>
			)}

			{/* The surf report's hairline tiles, for the piece: stock, code, options. */}
			<dl className="grid grid-cols-2 gap-px overflow-hidden rounded-tile border border-line bg-line">
				<div className="flex flex-col gap-1.5 bg-foam p-4">
					<dt className="label-mono text-[0.62rem] tracking-[0.2em] text-denim-deep">Stock</dt>
					<dd
						className={cn(
							"mono text-[0.95rem] font-bold",
							stockStatus?.tone === "out" && "text-coral-text",
							stockStatus?.tone === "low" && "text-coral-text",
						)}
					>
						{stockStatus?.label.toLowerCase() ?? "pick an option"}
					</dd>
				</div>
				<div className="flex flex-col gap-1.5 bg-foam p-4">
					<dt className="label-mono text-[0.62rem] tracking-[0.2em] text-denim-deep">Options</dt>
					<dd className="mono text-[0.95rem] font-bold">
						{variants.length === 1 ? "one size" : `${variants.length} to pick from`}
					</dd>
				</div>
				{selectedVariant?.sku && (
					<div className="col-span-2 flex flex-col gap-1.5 bg-sand p-4">
						<dt className="label-mono text-[0.62rem] tracking-[0.2em] text-denim-deep">Code</dt>
						<dd className="mono break-all text-[0.85rem]">{selectedVariant.sku}</dd>
					</div>
				)}
			</dl>
		</div>
	);
}
