"use client";

import { Plus } from "lucide-react";
import { type ReactNode, useState } from "react";
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

const LOW_STOCK_THRESHOLD = 5;

/** The blue price pill under the product title; follows the selected variant. */
export function PricePill({ variants }: { variants: Variant[] }) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const selectedVariant = useSelectedVariant(variants);
	const fmt = (amount: bigint | string) => formatMoney({ amount: BigInt(amount), currency, locale });

	const price = selectedVariant ? BigInt(displayPrice(selectedVariant, taxBehavior)) : null;
	const listPrice = selectedVariant
		? BigInt(
				displayPrice(selectedVariant, taxBehavior, "originalPrice") ??
					displayPrice(selectedVariant, taxBehavior),
			)
		: null;
	const onSale = price !== null && listPrice !== null && listPrice > price;
	const range = priceRange(variants, taxBehavior);
	const label =
		price !== null
			? fmt(price)
			: range.min === range.max
				? fmt(range.min)
				: `${fmt(range.min)} – ${fmt(range.max)}`;
	const omnibus =
		onSale && selectedVariant ? displayPrice(selectedVariant, taxBehavior, "omnibusPrice") : null;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap items-center gap-3">
				<p className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
					{label}
					<span className="ml-1 inline">{currency.toUpperCase()}</span>
				</p>
				{onSale && listPrice !== null ? (
					<p className="text-sm text-muted-foreground line-through">{fmt(listPrice)}</p>
				) : null}
			</div>
			{omnibus ? (
				<p className="text-xs text-muted-foreground">Lowest price in the last 30 days: {fmt(omnibus)}</p>
			) : null}
		</div>
	);
}

export function AddToCartButton({
	variants,
	product,
	description,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	subscriptionMode = "optional",
	plans = [],
}: {
	variants: Variant[];
	product: { id: string; name: string; slug: string; images: string[] };
	/** Server-rendered summary and rich description, placed between the options and the button. */
	description?: ReactNode;
	volumePricingTiers?: VolumeTier[];
	/** Show a "remind me when back in stock" flow when out of stock (Restock Notifications module). */
	restockNotificationsEnabled?: boolean;
	/** How the product may be bought: once or on a plan (`optional`), on a plan only (`only`), or as a curated box (`rolling`). */
	subscriptionMode?: "optional" | "only" | "rolling";
	/** Active plans, in display order. */
	plans?: SubscriptionPlan[];
}) {
	const { taxBehavior } = useStoreConfig();
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
	const lowStock =
		selectedVariant?.stock != null &&
		selectedVariant.stock > 0 &&
		selectedVariant.stock <= LOW_STOCK_THRESHOLD
			? selectedVariant.stock
			: null;

	const { resolvedTiers, volumePrice } = useVolumePricing(
		volumePricingTiers,
		selectedVariant?.id,
		1,
		taxBehavior,
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const previousQuantity =
			items.find((item) => itemKey(item) === lineKey(variantId, planId))?.quantity ?? 0;

		trackAddToCart(selectedVariant, product.name, 1);
		openCart();

		// Instant local feedback OUTSIDE the transition, then REPLACE with the server-returned
		// cart (never refetch — cartGet reads a replica that can lag the write).
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
				subscriptionPlanId: planId,
				subscriptionPlan: plan,
				productVariant: {
					id: variantId,
					price: selectedVariant.price,
					priceGross: selectedVariant.priceGross,
					images: selectedVariant.images,
					// So the line names its options at once, not only after the server replies.
					combinations: selectedVariant.combinations,
					product,
				},
			},
		});

		startMutation(async () => {
			const result = await addToCart(variantId, 1, planId);
			const line = result.cart?.lineItems.find((item) => itemKey(item) === lineKey(variantId, planId));
			if (result.success && result.cart && line) {
				syncCart(result.cart);
				if (line.quantity < previousQuantity + 1) {
					toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
				}
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	const buttonClasses =
		"relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
	const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";
	const buttonLabel = plan
		? plan.discountPercent > 0
			? `Subscribe & Save ${plan.discountPercent}%`
			: "Subscribe"
		: "Add To Cart";

	return (
		<>
			{variants.length > 1 && <VariantSelector variants={variants} />}
			{description}
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
					<VolumePricingDisplay tiers={resolvedTiers} quantity={1} volumePrice={volumePrice} />
					{lowStock ? (
						<p className="mb-4 text-sm text-muted-foreground">Only {lowStock} left in stock</p>
					) : null}

					{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
						<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
					) : (
						<form onSubmit={handleSubmit}>
							{isOutOfStock ? (
								<button type="submit" disabled className={cn(buttonClasses, disabledClasses)}>
									Out Of Stock
								</button>
							) : (
								<button
									type="submit"
									disabled={!selectedVariant}
									aria-label={selectedVariant ? `${buttonLabel}, ${product.name}` : "Please select an option"}
									className={cn(buttonClasses, selectedVariant ? "hover:opacity-90" : disabledClasses)}
								>
									<span className="absolute left-0 ml-4">
										<Plus className="h-5 w-5" aria-hidden="true" />
									</span>
									{buttonLabel}
								</button>
							)}
						</form>
					)}
				</>
			) : (
				<p className="text-sm text-muted-foreground">This subscription isn't available right now.</p>
			)}
		</>
	);
}
