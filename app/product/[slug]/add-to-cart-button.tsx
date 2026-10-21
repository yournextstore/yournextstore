"use client";

import { useMemo, useState } from "react";
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
	const { currency, locale, taxBehavior, language } = useStoreConfig();
	const [quantity, setQuantity] = useState(1);
	const [showAll, setShowAll] = useState(false);
	const longSummary = (summary?.length ?? 0) > 320;
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
		if (totalPrice) {
			return `Add to cart, ${formatMoney({ amount: totalPrice, currency, locale })}`;
		}
		return "Add to cart";
	}, [selectedVariant, isOutOfStock, plan, totalPrice, locale, currency]);

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
		const previousQuantity =
			items.find((item) => itemKey(item) === lineKey(variantId, planId))?.quantity ?? 0;

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
					<strong className="text-[clamp(2rem,3vw,2.6rem)] font-black leading-none tabular-nums text-ink">
						{priceInfo.display}
					</strong>
					{priceInfo.compareAt && <del className="text-[0.9rem] text-ink-soft">{priceInfo.compareAt}</del>}
					{priceInfo.discountPercent ? <span className="tag">save {priceInfo.discountPercent}%</span> : null}
				</div>
				{omnibusPrice && (
					<p className="text-xs text-ink-soft">Lowest price in the last 30 days: {omnibusPrice}</p>
				)}
			</div>

			{summary && (
				<div className="max-w-[56ch]">
					<p
						id="product-summary"
						className={cn(
							"whitespace-pre-line text-[1.2rem] text-ink",
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
							className="eyebrow mt-2 underline underline-offset-4 hover:text-orange"
						>
							{showAll ? "Read less" : "Read more"}
						</button>
					)}
				</div>
			)}

			{variants.length > 1 && <VariantSelector variants={variants} />}

			{purchasable ? (
				<>
					{plans.length > 0 && (
						<SubscriptionOptions
							plans={plans}
							value={planId}
							onChange={setPlanId}
							allowOneTime={allowOneTime}
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
								className="btn min-w-40 flex-1 [--btn-py:1rem] md:[--btn-size:1.35rem]"
							>
								{selectedVariant && !isOutOfStock && !plan ? "Add to cart" : buttonText}
							</button>
							<button
								type="submit"
								value="buy-now"
								disabled={!selectedVariant || isOutOfStock}
								className="btn btn-ghost min-w-40 flex-1 basis-full [--btn-py:1rem] sm:basis-0 md:[--btn-size:1.35rem]"
							>
								Buy now
							</button>
						</form>
					)}
				</>
			) : (
				<p className="text-lg text-ink">This subscription isn't available right now.</p>
			)}

			{/* Three flavour panels for the facts: stock, options, code. */}
			<dl className="grid grid-cols-2 gap-2.5">
				<div className="flex flex-col gap-1 rounded-2xl bg-lime p-4">
					<dt className="eyebrow text-[0.7rem]">Stock</dt>
					<dd
						className={cn(
							"text-[1.1rem] font-bold first-letter:uppercase",
							stockStatus?.tone === "out" && "text-orange-hover",
							stockStatus?.tone === "low" && "text-orange-hover",
						)}
					>
						{stockStatus?.label.toLowerCase() ?? "pick an option"}
					</dd>
				</div>
				<div className="flex flex-col gap-1 rounded-2xl bg-blush p-4">
					<dt className="eyebrow text-[0.7rem]">Options</dt>
					<dd className="text-[1.1rem] font-bold">
						{variants.length === 1 ? "One size" : `${variants.length} to pick from`}
					</dd>
				</div>
				{selectedVariant?.sku && (
					<div className="col-span-2 flex flex-col gap-1 rounded-2xl bg-sky p-4">
						<dt className="eyebrow text-[0.7rem]">Code</dt>
						<dd className="break-all text-[0.85rem]">{selectedVariant.sku}</dd>
					</div>
				)}
			</dl>
		</div>
	);
}
