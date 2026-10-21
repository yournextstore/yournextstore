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
	/** The product name, set as the panel's h1 beside the live price (as in the original header). */
	name: string;
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
	name,
	variants,
	product,
	summary,
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
	const totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

	const buttonText = useMemo(() => {
		if (!selectedVariant) return "Select options";
		if (isOutOfStock) return "Out of Stock";
		if (totalPrice && effectiveQuantity > 1) {
			return `Add To Cart — ${formatMoney({ amount: totalPrice, currency, locale })}`;
		}
		return "Add To Cart";
	}, [selectedVariant, isOutOfStock, totalPrice, effectiveQuantity, locale, currency]);

	// "BLACK / SMALL" above the name, like the original's product--variant line.
	const variantLine = selectedVariant?.combinations.map((c) => c.variantValue.value).join(" / ") ?? "";

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
		<>
			<div className="m-auto w-full max-w-xl p-4 md:p-8">
				<div className="mb-8 flex border-b border-border pb-2">
					<div className="pr-8 md:pr-12">
						{(variantLine || stockStatus) && (
							<p className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-nav leading-[1.6] font-semibold tracking-wider uppercase">
								{variantLine && <span>{variantLine}</span>}
								{stockStatus && stockStatus.tone !== "in" && (
									<span className="hull-indicator inline-flex items-center rounded-full bg-foreground py-1.5 pr-3 pl-2 text-micro leading-none font-normal tracking-normal text-background normal-case">
										{stockStatus.label}
									</span>
								)}
							</p>
						)}
						<h1 className="text-h3 leading-[1.35] text-balance">{name}</h1>
					</div>
					<div className="mt-auto ml-auto flex shrink-0 flex-col items-end">
						{priceInfo.discountPercent ? (
							<span className="mb-2 rounded-md bg-foreground p-1 text-tag font-semibold tracking-widest text-background uppercase">
								{priceInfo.discountPercent}% Off
							</span>
						) : null}
						{priceInfo.compareAt && (
							<span className="text-nav text-muted-foreground line-through">{priceInfo.compareAt}</span>
						)}
						<span className="text-h5 leading-[1.5] font-semibold whitespace-nowrap">{priceInfo.display}</span>
					</div>
				</div>

				{summary && <p className="text-body whitespace-pre-line">{summary}</p>}

				{omnibusPrice && (
					<p className="mt-4 text-micro text-muted-foreground">
						Lowest price in the last 30 days: {omnibusPrice}
					</p>
				)}
				{selectedVariant?.sku && (
					<p className="mt-4 text-micro font-semibold tracking-wider uppercase">SKU {selectedVariant.sku}</p>
				)}

				{variants.length > 1 && (
					<div className="mt-12">
						<VariantSelector variants={variants} />
					</div>
				)}

				<div className="mt-8 empty:hidden">
					<VolumePricingDisplay
						tiers={resolvedTiers}
						quantity={effectiveQuantity}
						volumePrice={volumePrice}
					/>
				</div>
			</div>

			{/* The original's product--actions: a dotted bar that sticks to the viewport bottom. */}
			<div
				data-buy-bar
				className="hull-dots sticky bottom-0 z-10 mt-4 border-t border-border p-4 text-center md:p-8"
			>
				{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
					<div className="bg-background p-4 text-left">
						<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
					</div>
				) : (
					<form onSubmit={handleSubmit} className="flex items-stretch gap-4">
						<QuantitySelector
							quantity={effectiveQuantity}
							onQuantityChange={setQuantity}
							max={Math.max(1, Math.min(99, maxQuantity))}
							disabled={isOutOfStock}
						/>
						<button
							type="submit"
							disabled={!selectedVariant || isOutOfStock}
							className="hull-btn hull-btn-primary hull-btn-large flex-1"
						>
							{buttonText}
						</button>
					</form>
				)}
			</div>
		</>
	);
}
