"use client";

import { type ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { itemKey, lineKey } from "@/app/cart/cart-math";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
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
	/** Server-rendered rows for the details grid ("Category :", …), shown above Availability. */
	details?: ReactNode;
	/** Outline button beside Add To Cart (the original's second action). */
	secondaryAction?: ReactNode;
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
	details,
	secondaryAction,
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
		if (!selectedVariant) return "Select Options";
		if (isOutOfStock) return "Out of Stock";
		if (plan) return plan.discountPercent > 0 ? `Subscribe & Save ${plan.discountPercent}%` : "Subscribe";
		return "Add To Cart";
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
				} else {
					toast.success("Added to cart", {
						description: product.name,
						action: { label: "View cart", onClick: openCart },
					});
				}
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div>
			{summary && (
				<div className="my-2 space-y-2 leading-relaxed md:my-4">
					{summary
						.split(/\n{2,}/)
						.filter((paragraph) => paragraph.trim())
						.map((paragraph) => (
							<p key={paragraph.slice(0, 48)} className="whitespace-pre-line">
								{paragraph}
							</p>
						))}
				</div>
			)}

			<hr className="my-4 border-rule md:my-6" />

			<dl className="grid grid-cols-2 gap-y-2 md:grid-cols-3 md:gap-y-4 lg:grid-cols-4">
				{details}
				<dt>Availability :</dt>
				<dd
					className={cn(
						"md:col-span-2 lg:col-span-3",
						stockStatus?.tone === "out" && "text-destructive",
						stockStatus?.tone === "low" && "text-amber-800",
					)}
				>
					{stockStatus?.label ?? "Choose an option"}
				</dd>
				{selectedVariant?.sku ? (
					<>
						<dt>SKU :</dt>
						<dd className="md:col-span-2 lg:col-span-3">{selectedVariant.sku}</dd>
					</>
				) : null}
			</dl>

			{variants.length > 1 && (
				<div className="mt-6">
					<VariantSelector variants={variants} />
				</div>
			)}

			{purchasable ? (
				<>
					{plans.length > 0 && (
						<div className="mt-6">
							<SubscriptionOptions
								plans={plans}
								value={planId}
								onChange={setPlanId}
								allowOneTime={allowOneTime}
							/>
						</div>
					)}

					<div className="my-4 flex items-center justify-between gap-4 md:my-6 md:flex-col-reverse md:items-start md:gap-y-6">
						<QuantitySelector
							quantity={effectiveQuantity}
							onQuantityChange={setQuantity}
							max={Math.max(1, Math.min(99, maxQuantity))}
							disabled={isOutOfStock}
						/>
						<div className="text-right md:text-left">
							<div className="flex flex-wrap items-baseline justify-end gap-x-3 md:justify-start">
								<span className="text-xl font-semibold tabular-nums">{priceInfo.display}</span>
								{priceInfo.compareAt && (
									<span className="text-base text-muted-foreground line-through">{priceInfo.compareAt}</span>
								)}
							</div>
							{omnibusPrice && (
								<p className="text-xs text-muted-foreground">
									Lowest price in the last 30 days: {omnibusPrice}
								</p>
							)}
							{totalPrice && effectiveQuantity > 1 ? (
								<p className="text-sm text-muted-foreground">
									Total {formatMoney({ amount: totalPrice, currency, locale })}
								</p>
							) : null}
						</div>
					</div>

					<VolumePricingDisplay
						tiers={resolvedTiers}
						quantity={effectiveQuantity}
						volumePrice={volumePrice}
					/>

					{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
						<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
					) : (
						<form onSubmit={handleSubmit} className="my-6 flex flex-col gap-4 md:flex-row md:gap-8">
							<button
								type="submit"
								disabled={!selectedVariant || isOutOfStock}
								className="btn-shelf w-full py-2 text-lg font-medium"
							>
								{buttonText}
							</button>
							{secondaryAction}
						</form>
					)}
				</>
			) : (
				<p className="my-6 italic text-muted-foreground">This subscription isn't available right now.</p>
			)}
		</div>
	);
}
