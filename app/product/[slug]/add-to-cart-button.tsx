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
	summary?: string | null;
	volumePricingTiers?: VolumeTier[];
	/** Show a "remind me when back in stock" flow when out of stock (Restock Notifications module). */
	restockNotificationsEnabled?: boolean;
	/** The server-rendered title block, placed at the top of the grey details column. */
	heading?: React.ReactNode;
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	heading,
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

	const _unitPrice = volumePrice ?? (selectedVariant ? displayPrice(selectedVariant, taxBehavior) : null);

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

	// Two grid items: the grey details column (title, price, then copy and options pinned to its
	// foot, as in the original) and the green Add to cart bar that docks above the bottom bar
	// across both columns.
	return (
		<>
			<div className="flex flex-col bg-swag-gray px-4 pt-4 pb-6 lg:sticky lg:top-0 lg:h-[calc(100svh-80px)] lg:px-[14px] lg:pt-[14px]">
				{heading}
				<div className="font-sans text-t30 sm:text-t56">
					<span className="tabular-nums">{priceInfo.display}</span>
					{priceInfo.compareAt && (
						<span className="ml-3 align-middle font-sans text-t24 line-through">{priceInfo.compareAt}</span>
					)}
				</div>
				{(priceInfo.discountPercent || omnibusPrice) && (
					<p className="mt-2 text-t14 uppercase">
						{priceInfo.discountPercent ? (
							<span className="mr-3 bg-swag-red px-1 text-white">−{priceInfo.discountPercent}%</span>
						) : null}
						{omnibusPrice && <>Lowest price in the last 30 days: {omnibusPrice}</>}
					</p>
				)}
				<div className="min-h-8 flex-1" />
				{summary && (
					<section
						aria-label="Description"
						// biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be reachable by keyboard.
						tabIndex={0}
						className="min-h-0 shrink overflow-y-auto pr-1 text-t14 leading-[1.5] whitespace-pre-line uppercase lg:max-h-[45%]"
					>
						{summary.trim()}
					</section>
				)}
				<div className="mt-5 space-y-0">
					{variants.length > 1 && <VariantSelector variants={variants} />}
					<QuantitySelector
						quantity={effectiveQuantity}
						onQuantityChange={setQuantity}
						max={Math.max(1, Math.min(99, maxQuantity))}
						disabled={isOutOfStock}
					/>
				</div>
				{stockStatus && (
					<p className="mt-3 text-t14 uppercase">
						{stockStatus.label}
						{selectedVariant?.sku ? <span> · SKU {selectedVariant.sku}</span> : null}
					</p>
				)}
				<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />
				{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
					<div className="mt-4">
						<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
					</div>
				) : null}
			</div>
			{isOutOfStock && restockNotificationsEnabled && selectedVariant ? null : (
				<form onSubmit={handleSubmit} className="sticky bottom-[var(--dock-h)] z-30 lg:col-span-2">
					<button
						type="submit"
						disabled={!selectedVariant || isOutOfStock}
						className="h-10 w-full cursor-pointer bg-swag-green font-sans text-t16 font-medium text-black transition-colors hover:bg-black hover:text-swag-green disabled:cursor-not-allowed disabled:bg-swag-gray"
					>
						{buttonText}
					</button>
				</form>
			)}
		</>
	);
}
