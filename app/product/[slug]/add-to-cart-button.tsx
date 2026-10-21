"use client";

import { Share2 } from "lucide-react";
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
	// The original adds one at a time; quantities are edited in the cart drawer.
	const quantity = 1;
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
		if (!selectedVariant) return "Choose options";
		if (isOutOfStock) return "Sold out";
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

	const handleShare = async () => {
		const url = window.location.href;
		if (navigator.share) {
			await navigator.share({ title: document.title, url }).catch(() => undefined);
			return;
		}
		const [error] = await navigator.clipboard
			.writeText(url)
			.then(() => [null] as const)
			.catch((e: unknown) => [e] as const);
		if (error) {
			toast.error("Sharing isn't supported in this browser");
		} else {
			toast.success("Link copied");
		}
	};

	const unavailable = !selectedVariant || isOutOfStock;

	return (
		<div className="flex flex-col">
			{(priceInfo.compareAt || (!selectedVariant && variants.length > 1)) && (
				<div className="mb-4 space-y-1">
					<span className="flex flex-wrap items-baseline gap-2.5">
						{priceInfo.compareAt && (
							<span className="text-sm font-medium text-muted-foreground line-through">
								<span className="sr-only">Was </span>
								{priceInfo.compareAt}
							</span>
						)}
						<span className="text-xl font-bold tracking-tight">{priceInfo.display}</span>
						{priceInfo.discountPercent ? (
							<span className="rounded-full bg-neutral-600 px-2.5 py-0.5 text-xs font-semibold text-white">
								-{priceInfo.discountPercent}%
							</span>
						) : null}
					</span>
					{omnibusPrice && (
						<p className="text-xs text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
					)}
				</div>
			)}

			{variants.length > 1 && (
				<div className="border-b border-border pb-5">
					<VariantSelector variants={variants} />
				</div>
			)}

			{purchasable && plans.length > 0 && (
				<div className="border-b border-border py-5">
					<SubscriptionOptions
						plans={plans}
						value={planId}
						onChange={setPlanId}
						allowOneTime={allowOneTime}
					/>
				</div>
			)}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			<div className="flex min-h-14 flex-wrap items-center justify-center gap-x-4 gap-y-1 py-4 text-center">
				{stockStatus && stockStatus.tone !== "in" ? (
					<p
						className={cn(
							"font-mono text-sm font-medium uppercase",
							stockStatus.tone === "out" ? "text-destructive" : "text-muted-foreground",
						)}
					>
						{stockStatus.label}
					</p>
				) : (
					<p className="font-mono text-sm font-medium text-muted-foreground uppercase">
						{selectedVariant ? "In stock" : "Select your options"}
					</p>
				)}
				{selectedVariant?.sku && (
					<p className="font-mono text-xs text-muted-foreground uppercase">SKU {selectedVariant.sku}</p>
				)}
			</div>

			{!purchasable ? (
				<p className="pb-2 text-center text-sm text-muted-foreground">
					This subscription isn't available right now.
				</p>
			) : isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
			) : (
				<form onSubmit={handleSubmit} className="flex w-full items-stretch gap-3 pb-2">
					<button
						type="submit"
						disabled={unavailable}
						aria-label={unavailable ? buttonText : `${buttonText}, ${product.name}`}
						className={cn(
							"h-12 flex-1 rounded-lg bg-primary text-sm font-semibold tracking-[0.08em] text-primary-foreground uppercase transition-all duration-200 hover:bg-(--rose-hover) active:scale-[0.98] dark:hover:bg-[#be123c]",
							unavailable &&
								"cursor-not-allowed bg-neutral-200 text-neutral-600 hover:bg-neutral-200 active:scale-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800",
						)}
					>
						{buttonText}
					</button>
					<button
						type="button"
						onClick={handleShare}
						aria-label="Share"
						className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg border border-[#be123c] bg-(--rose-tint) text-[#881337] transition-all duration-200 hover:opacity-90 active:scale-[0.98] dark:border-[#fb7185] dark:text-[#fecdd3]"
					>
						<Share2 className="size-[22px]" aria-hidden="true" />
					</button>
				</form>
			)}

			{summary && <p className="mt-4 leading-relaxed whitespace-pre-line text-muted-foreground">{summary}</p>}
		</div>
	);
}
