"use client";

import { ShoppingBag } from "lucide-react";
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
import { HeartPin } from "@/components/maison/vault";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";
import type { SavedPiece } from "@/lib/vault";

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
	/** The record as the vault stores it, for the heart beside the price. */
	saved: SavedPiece;
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
	saved,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	subscriptionMode = "optional",
	plans = [],
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	// One piece per press, as in the original; quantities are adjusted in the bag.
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
		if (!selectedVariant) return "Choose an option";
		if (isOutOfStock) return "Sold out";
		if (plan) return plan.discountPercent > 0 ? `Subscribe & save ${plan.discountPercent}%` : "Subscribe";
		return "Add to bag";
	}, [selectedVariant, isOutOfStock, plan]);
	const addedLabel = totalPrice ? formatMoney({ amount: totalPrice, currency, locale }) : null;

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
		if (stock === 0) return { label: "Sold out", tone: "out" as const };
		if (stock !== null && stock <= LOW_STOCK_THRESHOLD) {
			return {
				label: stock === 1 ? "The last one in the register" : `${stock} left in the register`,
				tone: "low" as const,
			};
		}
		return { label: "In stock, ready to dispatch", tone: "in" as const };
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
		<div className="flex flex-col">
			{stockStatus ? (
				<div className="flex flex-wrap gap-x-[18px] gap-y-1 border-t border-line py-3">
					<span className="eti w-[140px] flex-none text-faint">Availability</span>
					<span
						className={cn(
							"min-w-0 flex-1 text-[13.5px]",
							stockStatus.tone === "in" ? "text-ink" : "text-acc",
						)}
					>
						{stockStatus.label}
					</span>
				</div>
			) : null}
			{selectedVariant?.sku ? (
				<div className="flex flex-wrap gap-x-[18px] gap-y-1 border-t border-line py-3">
					<span className="eti w-[140px] flex-none text-faint">SKU</span>
					<span className="min-w-0 flex-1 font-mono text-[12.5px] text-ink">{selectedVariant.sku}</span>
				</div>
			) : null}

			{variants.length > 1 && <VariantSelector variants={variants} />}

			{purchasable && plans.length > 0 && (
				<SubscriptionOptions plans={plans} value={planId} onChange={setPlanId} allowOneTime={allowOneTime} />
			)}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			<div className="mt-3 flex flex-wrap items-center gap-x-[14px] gap-y-3.5 border-t border-rule pt-5">
				<span className="flex flex-wrap items-baseline gap-x-2.5">
					<span className="font-mono text-[19px]">{priceInfo.display}</span>
					{priceInfo.compareAt ? (
						<s className="font-mono text-[13px] text-faint">{priceInfo.compareAt}</s>
					) : null}
					{priceInfo.discountPercent ? (
						<span className="eti text-[10px] text-acc">Reduced {priceInfo.discountPercent}%</span>
					) : null}
				</span>
				<span className="flex-1" />
				<HeartPin piece={saved} large />
				{!purchasable ? (
					<span className="text-[12.5px] text-dim">This subscription isn't available right now.</span>
				) : isOutOfStock && restockNotificationsEnabled && selectedVariant ? null : (
					<form onSubmit={handleSubmit}>
						<button
							type="submit"
							disabled={!selectedVariant || isOutOfStock}
							aria-label={
								addedLabel && !isOutOfStock && selectedVariant ? `${buttonText}, ${addedLabel}` : undefined
							}
							className="btn-keeper flex items-center gap-2 px-[22px] py-[13px]"
						>
							<ShoppingBag aria-hidden className="size-[13px]" strokeWidth={1.5} />
							<span>{buttonText}</span>
						</button>
					</form>
				)}
			</div>

			{omnibusPrice && (
				<p className="mt-3 text-[12.5px] text-dim">Lowest price in the last 30 days: {omnibusPrice}</p>
			)}

			{purchasable && isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<div className="mt-4">
					<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
				</div>
			) : null}

			<p className="mt-4 text-[12.5px] leading-[1.6] text-dim">
				{taxBehavior === "inclusive" ? "Taxes included. " : ""}Shipping is calculated at checkout.
			</p>
		</div>
	);
}
