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
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	subscriptionMode = "optional",
	plans = [],
}: AddToCartButtonProps) {
	const { taxBehavior } = useStoreConfig();
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

	const buttonText = !selectedVariant
		? "Select options"
		: isOutOfStock
			? "Out of stock"
			: plan
				? plan.discountPercent > 0
					? `Subscribe & save ${plan.discountPercent}%`
					: "Subscribe"
				: "Add to cart";

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
		<div className="space-y-6">
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
						<form onSubmit={handleSubmit} className="flex flex-wrap items-stretch gap-2">
							<QuantitySelector
								quantity={effectiveQuantity}
								onQuantityChange={setQuantity}
								max={Math.max(1, Math.min(99, maxQuantity))}
								disabled={isOutOfStock}
							/>
							<button
								type="submit"
								disabled={!selectedVariant || isOutOfStock}
								className="btn-soul btn-primary min-h-12 flex-1 px-5 py-3 text-base xs:max-w-56"
							>
								{buttonText}
							</button>
						</form>
					)}
				</>
			) : (
				<p className="text-contrast-500">This subscription isn't available right now.</p>
			)}

			{(selectedVariant?.sku || stockStatus) && (
				<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
					{stockStatus && (
						<span
							className={cn(
								"inline-flex items-center gap-1.5 font-medium",
								stockStatus.tone === "out" && "text-destructive",
								stockStatus.tone === "low" && "text-[#8a5a00]",
								stockStatus.tone === "in" && "text-[#2f6a12]",
							)}
						>
							<span className="size-1.5 rounded-full bg-current" aria-hidden />
							{stockStatus.label}
						</span>
					)}
					{selectedVariant?.sku && (
						<span className="text-contrast-500">
							SKU: <span className="font-medium text-foreground">{selectedVariant.sku}</span>
						</span>
					)}
				</div>
			)}
		</div>
	);
}
