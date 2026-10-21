"use client";

import { type ReactNode, useMemo, useState } from "react";
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
	summary?: string | null;
	/** Rich product content, rendered under the summary like minshop's description. */
	description?: ReactNode;
	volumePricingTiers?: VolumeTier[];
	/** Show a "remind me when back in stock" flow when out of stock (Restock Notifications module). */
	restockNotificationsEnabled?: boolean;
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	description,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const [quantity, setQuantity] = useState(1);
	const [buyingNow, setBuyingNow] = useState(false);
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

	const { language } = useStoreConfig();
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

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
			return { label: `Low stock — ${stock} left`, tone: "low" as const };
		}
		return null;
	}, [selectedVariant]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!selectedVariant || isOutOfStock) return;
		// "Buy now" adds the line, then leaves for the hosted checkout instead of opening the drawer.
		const submitter = (e.nativeEvent as SubmitEvent).submitter;
		const buyNow = submitter instanceof HTMLElement && submitter.dataset.buyNow === "true";

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;

		trackAddToCart(selectedVariant, product.name, addedQuantity);

		if (buyNow) {
			setBuyingNow(true);
		} else {
			openCart();
		}
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
				setBuyingNow(false);
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div>
			{/* Price & sale */}
			<p className="mt-4 flex flex-wrap items-baseline gap-x-3 text-2xl tabular-nums text-muted-foreground">
				{priceInfo.display}
				{priceInfo.compareAt && (
					<span className="text-base text-faint line-through">{priceInfo.compareAt}</span>
				)}
			</p>
			{omnibusPrice && (
				<p className="mt-1 text-xs text-faint">Lowest price in the last 30 days: {omnibusPrice}</p>
			)}
			{stockStatus && (
				<p className={cn("mt-2 text-sm", stockStatus.tone === "out" ? "text-destructive" : "text-amber-800")}>
					{stockStatus.label}
				</p>
			)}

			{summary && <p className="mt-6 max-w-prose whitespace-pre-line text-muted-foreground">{summary}</p>}
			{description && <div className="mt-6">{description}</div>}

			<form onSubmit={handleSubmit} className="mt-8 max-w-sm">
				{variants.length > 1 && <VariantSelector variants={variants} />}

				<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

				{isOutOfStock ? (
					restockNotificationsEnabled && selectedVariant ? (
						<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
					) : (
						<span className="inline-block cursor-not-allowed rounded-md border border-line px-8 py-3 text-sm font-medium uppercase tracking-wider text-faint">
							Sold out
						</span>
					)
				) : (
					<div className="flex flex-wrap gap-3">
						<button
							type="submit"
							disabled={!selectedVariant}
							className="rounded-md border border-line px-8 py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
						>
							{selectedVariant ? "Add to cart" : "Select an option"}
						</button>
						<button
							type="submit"
							data-buy-now="true"
							disabled={!selectedVariant || buyingNow}
							className="rounded-md bg-primary px-8 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground transition hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{buyingNow ? "One moment…" : "Buy now"}
						</button>
					</div>
				)}
			</form>
		</div>
	);
}
