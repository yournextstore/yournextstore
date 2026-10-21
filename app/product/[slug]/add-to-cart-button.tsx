"use client";

import { Package, ShieldCheck, Truck } from "lucide-react";
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
		if (stock === 0) return { label: "Out of Stock", tone: "out" as const };
		if (stock !== null && stock <= LOW_STOCK_THRESHOLD) {
			return { label: `Only ${stock} left`, tone: "low" as const };
		}
		return { label: "In Stock", tone: "in" as const };
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
		<div className="flex flex-col gap-6">
			{/* Price & sale */}
			<div className="space-y-2">
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span className="font-price text-3xl font-bold tracking-[-0.02em] text-foreground">
						{priceInfo.display}
					</span>
					{priceInfo.compareAt && (
						<span className="font-price text-lg tracking-[-0.02em] text-muted-foreground line-through">
							<span className="sr-only">Was </span>
							{priceInfo.compareAt}
						</span>
					)}
					{priceInfo.discountPercent ? (
						<span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold tracking-widest text-brand-soft-foreground">
							−{priceInfo.discountPercent}% OFF
						</span>
					) : null}
				</div>
				{omnibusPrice && (
					<p className="text-xs text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
				)}
			</div>

			<div className="border-t border-border" />

			{summary && (
				<p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">{summary}</p>
			)}

			{variants.length > 1 && <VariantSelector variants={variants} />}

			{/* Stock & SKU */}
			{(selectedVariant?.sku || stockStatus) && (
				<div className="flex flex-wrap items-center gap-x-5 gap-y-1">
					{stockStatus && (
						<span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<span
								aria-hidden
								className={cn(
									"size-2 rounded-full",
									stockStatus.tone === "out" && "bg-red-500",
									stockStatus.tone === "low" && "bg-amber-500",
									stockStatus.tone === "in" && "bg-green-500",
								)}
							/>
							{stockStatus.label}
						</span>
					)}
					{selectedVariant?.sku && (
						<span className="font-price text-xs text-muted-foreground">SKU: {selectedVariant.sku}</span>
					)}
				</div>
			)}

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
					) : isOutOfStock || !selectedVariant ? (
						<button
							type="button"
							disabled
							className="w-full cursor-not-allowed rounded-full border border-border bg-secondary py-4 text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground"
						>
							{buttonText}
						</button>
					) : (
						<form onSubmit={handleSubmit} className="flex gap-3 pt-2">
							<QuantitySelector
								quantity={effectiveQuantity}
								onQuantityChange={setQuantity}
								max={Math.max(1, Math.min(99, maxQuantity))}
							/>
							<button
								type="submit"
								aria-label={`${buttonText}, ${product.name}`}
								className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors duration-300 hover:bg-brand hover:text-brand-foreground"
							>
								{buttonText}
							</button>
						</form>
					)}
				</>
			) : (
				<p className="text-sm text-muted-foreground">This subscription isn't available right now.</p>
			)}

			<Perks />
		</div>
	);
}

function Perks() {
	const perks = [
		{ icon: ShieldCheck, label: "Secure checkout", sub: "Encrypted payment" },
		{ icon: Truck, label: "Delivery options", sub: "Shown at checkout" },
		{ icon: Package, label: "Order updates", sub: "By email" },
	];
	return (
		<ul className="grid grid-cols-3 gap-3 pt-2">
			{perks.map(({ icon: Icon, label, sub }) => (
				<li key={label} className="rounded-xl border border-border bg-card p-3 text-center">
					<Icon className="mx-auto mb-1.5 size-5 text-brand-display" strokeWidth={1.75} aria-hidden />
					<p className="text-[10px] font-semibold leading-tight text-foreground/90">{label}</p>
					<p className="text-[10px] text-muted-foreground">{sub}</p>
				</li>
			))}
		</ul>
	);
}
