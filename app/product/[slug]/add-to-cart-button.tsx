"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { itemKey, lineKey } from "@/app/cart/cart-math";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { SubscriptionOptions, type SubscriptionPlan } from "@/app/product/[slug]/subscription-options";
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
	/** How the product may be bought: once or on a plan (`optional`), on a plan only (`only`), or as a curated box (`rolling`). */
	subscriptionMode?: "optional" | "only" | "rolling";
	/** Active plans, in display order. */
	plans?: SubscriptionPlan[];
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	subscriptionMode = "optional",
	plans = [],
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const [quantity, setQuantity] = useState(1);
	const { items, openCart, dispatch, syncCart, reconcile, startMutation } = useCart();

	const selectedVariant = useSelectedVariant(variants);
	const longSummary = (summary?.length ?? 0) > 320;

	// A product sold on a plan only starts on its first plan. A rolling box (contents that change every
	// cycle) needs more than this panel offers, so it isn't sold here.
	const allowOneTime = subscriptionMode === "optional";
	const [planId, setPlanId] = useState<string | null>(allowOneTime ? null : (plans[0]?.id ?? null));
	const plan = plans.find(({ id }) => id === planId) ?? null;
	const purchasable = allowOneTime || (subscriptionMode === "only" && plan !== null);

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
		if (plan) return plan.discountPercent > 0 ? `Subscribe & save ${plan.discountPercent}%` : "Subscribe";
		return "Add to cart";
	}, [selectedVariant, isOutOfStock, plan]);

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
			return { label: `Only ${stock} left`, tone: "low" as const };
		}
		return { label: stock === null ? "In stock" : `${stock} in stock`, tone: "in" as const };
	}, [selectedVariant]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity =
			items.find((item) => itemKey(item) === lineKey(variantId, planId))?.quantity ?? 0;

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
				subscriptionPlanId: planId,
				subscriptionPlan: plan,
				productVariant: {
					id: variantId,
					price: selectedVariant.price,
					// Carry the gross twin so the optimistic line renders in the same basis the
					// server-returned cart will use — no net/gross flip while the write is in flight.
					priceGross: selectedVariant.priceGross,
					images: selectedVariant.images,
					// So the line names its options at once, not only after the server replies.
					combinations: selectedVariant.combinations,
					product,
				},
			},
		});

		startMutation(async () => {
			// The server clamps line quantities to available stock and still responds
			// with the updated cart — sync from the RETURNED cart; reconcile only on failure.
			const result = await addToCart(variantId, addedQuantity, planId);
			const line = result.cart?.lineItems.find((item) => itemKey(item) === lineKey(variantId, planId));
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
		<div>
			{/* Price & sale */}
			<div className="mt-5 flex flex-wrap items-center gap-3">
				<span className="text-xl font-medium">{priceInfo.display}</span>
				{priceInfo.compareAt && <s className="text-base text-muted-foreground">{priceInfo.compareAt}</s>}
				{priceInfo.discountPercent ? (
					<span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
						−{priceInfo.discountPercent}%
					</span>
				) : null}
			</div>
			{omnibusPrice && (
				<p className="mt-2 text-xs text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
			)}

			{summary && (
				<p
					className={cn(
						"mt-6 max-w-lg text-sm leading-7 whitespace-pre-line text-muted-foreground",
						longSummary && "line-clamp-4",
					)}
				>
					{summary}
				</p>
			)}

			<div className="mt-8 space-y-6 border-t pt-7">
				{variants.length > 1 && <VariantSelector variants={variants} />}

				{purchasable && plans.length > 0 && (
					<SubscriptionOptions
						plans={plans}
						value={planId}
						onChange={setPlanId}
						allowOneTime={allowOneTime}
					/>
				)}

				{(stockStatus || selectedVariant?.sku) && (
					<p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
						{stockStatus && (
							<span
								className={cn(
									stockStatus.tone === "out" && "text-destructive",
									stockStatus.tone === "low" && "text-amber-800 dark:text-amber-400",
									stockStatus.tone === "in" && "text-muted-foreground",
								)}
							>
								{stockStatus.label}
							</span>
						)}
						{selectedVariant?.sku && <span className="text-muted-foreground">SKU {selectedVariant.sku}</span>}
					</p>
				)}

				<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />
			</div>

			{!purchasable ? (
				<p className="mt-7 text-sm text-muted-foreground">This subscription isn't available right now.</p>
			) : isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<div className="mt-7">
					<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
				</div>
			) : (
				<form onSubmit={handleSubmit}>
					<button
						type="submit"
						disabled={!selectedVariant || isOutOfStock}
						className="mt-7 min-h-12 w-full cursor-pointer rounded-md bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{buttonText}
					</button>
				</form>
			)}
			<p className="mt-4 text-center text-xs leading-6 text-muted-foreground">
				Secure checkout. Shipping is calculated at the next step.
			</p>
			{/* A long description would push the options below the fold: a short lead above, the full text here. */}
			{summary && longSummary && (
				<details className="group mt-8 border-t pt-5">
					<summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
						Full description
						<span
							aria-hidden="true"
							className="text-lg leading-none transition-transform group-open:rotate-45"
						>
							+
						</span>
					</summary>
					<p className="mt-4 max-w-lg text-sm leading-7 whitespace-pre-line text-muted-foreground">
						{summary}
					</p>
				</details>
			)}
		</div>
	);
}
