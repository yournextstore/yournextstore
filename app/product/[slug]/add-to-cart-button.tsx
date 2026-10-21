"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { itemKey, lineKey } from "@/app/cart/cart-math";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { SubscriptionOptions, type SubscriptionPlan } from "@/app/product/[slug]/subscription-options";
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

	const unitPrice = volumePrice ?? (selectedVariant ? displayPrice(selectedVariant, taxBehavior) : null);
	const totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

	const buttonText = useMemo(() => {
		if (!selectedVariant) return "Select options";
		if (isOutOfStock) return "Out of stock";
		if (plan) return plan.discountPercent > 0 ? `Subscribe & save ${plan.discountPercent}%` : "Subscribe";
		return "Add to cart";
	}, [selectedVariant, isOutOfStock, plan]);
	const totalLabel =
		totalPrice && effectiveQuantity > 1 ? formatMoney({ amount: totalPrice, currency, locale }) : null;

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
			<p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xl">
				{priceInfo.compareAt && <s className="text-[16px] text-muted-foreground">{priceInfo.compareAt}</s>}
				<span className={cn("font-semibold", priceInfo.compareAt && "text-brass")}>{priceInfo.display}</span>
				{priceInfo.discountPercent ? (
					<span className="ml-1 rounded-md bg-brass px-2 py-0.5 text-[12px] font-bold text-on-brass">
						−{priceInfo.discountPercent}%
					</span>
				) : null}
			</p>
			{omnibusPrice && (
				<p className="mt-1 text-[12px] text-muted-foreground">
					Lowest price in the last 30 days: {omnibusPrice}
				</p>
			)}

			{summary && (
				<p className="mt-6 max-w-[52ch] whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
					{summary}
				</p>
			)}

			{stockStatus && stockStatus.tone !== "in" && (
				<p
					className={cn(
						"mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium",
						stockStatus.tone === "out" ? "text-destructive" : "text-brass",
					)}
				>
					<span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
					{stockStatus.label}
				</p>
			)}

			{variants.length > 1 && (
				<div className="mt-7">
					<VariantSelector variants={variants} />
				</div>
			)}

			{purchasable ? (
				<>
					{plans.length > 0 && (
						<div className="mt-7">
							<SubscriptionOptions
								plans={plans}
								value={planId}
								onChange={setPlanId}
								allowOneTime={allowOneTime}
							/>
						</div>
					)}

					<VolumePricingDisplay
						tiers={resolvedTiers}
						quantity={effectiveQuantity}
						volumePrice={volumePrice}
					/>

					{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
						<div className="mt-7">
							<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
						</div>
					) : (
						<form onSubmit={handleSubmit} className="mt-7 flex gap-3">
							<QuantitySelector
								quantity={effectiveQuantity}
								onQuantityChange={setQuantity}
								max={Math.max(1, Math.min(99, maxQuantity))}
								disabled={isOutOfStock}
							/>
							<button
								type="submit"
								disabled={!selectedVariant || isOutOfStock}
								className="flex-1 rounded-md bg-primary px-4 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{buttonText}
								{totalLabel && <span className="font-normal opacity-80"> · {totalLabel}</span>}
							</button>
						</form>
					)}
				</>
			) : (
				<p className="mt-7 text-[14px] text-muted-foreground">This subscription isn't available right now.</p>
			)}

			{selectedVariant?.sku && (
				<p className="mt-3 text-[12px] text-muted-foreground">SKU {selectedVariant.sku}</p>
			)}

			<div className="mt-6">
				<TrustBadges />
			</div>
		</div>
	);
}
