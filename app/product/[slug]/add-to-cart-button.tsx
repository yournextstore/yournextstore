"use client";

import { Plus } from "lucide-react";
import type { ReactNode } from "react";
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

const LOW_STOCK_THRESHOLD = 5;

/** The amber price pill under the title with the stock state beside it; follows the selected variant. */
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
	const soldOut = selectedVariant ? selectedVariant.stock === 0 : variants.every((v) => v.stock === 0);

	return (
		<div className="mt-4 flex flex-col gap-2">
			<div className="flex flex-wrap items-center gap-3">
				<p className="aq-spec rounded-full bg-amber px-4 py-1.5 text-lg font-semibold text-black">
					{label}
					<span className="ml-1.5 inline text-base">{currency.toUpperCase()}</span>
				</p>
				{onSale && listPrice !== null ? (
					<s className="aq-spec text-sm text-[#8a9a9c]">
						<span className="sr-only">Was </span>
						{fmt(listPrice)}
					</s>
				) : null}
				{soldOut ? (
					<span className="text-sm text-red-400">Currently out of stock</span>
				) : (
					<span className="text-sm text-[#a3a3a3]">In stock</span>
				)}
			</div>
			{omnibus ? (
				<p className="text-xs text-[#8a9a9c]">Lowest price in the last 30 days: {fmt(omnibus)}</p>
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
}: {
	variants: Variant[];
	product: { id: string; name: string; slug: string; images: string[] };
	/** Server-rendered summary and rich description, placed between the options and the button. */
	description?: ReactNode;
	volumePricingTiers?: VolumeTier[];
	/** Show a "remind me when back in stock" flow when out of stock (Restock Notifications module). */
	restockNotificationsEnabled?: boolean;
}) {
	const { taxBehavior } = useStoreConfig();
	const { items, openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const selectedVariant = useSelectedVariant(variants);

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
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;

		trackAddToCart(selectedVariant, product.name, 1);
		openCart();

		// Instant local feedback OUTSIDE the transition, then REPLACE with the server-returned
		// cart (never refetch — cartGet reads a replica that can lag the write).
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
				productVariant: {
					id: variantId,
					price: selectedVariant.price,
					priceGross: selectedVariant.priceGross,
					images: selectedVariant.images,
					product,
				},
			},
		});

		startMutation(async () => {
			const result = await addToCart(variantId, 1);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
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
		"relative flex w-full items-center justify-center gap-2 rounded-full p-4 text-sm font-semibold tracking-wide uppercase transition active:scale-[0.99]";
	const enabledClasses =
		"bg-amber text-black shadow-[0_10px_30px_-12px_rgba(242,169,59,0.6)] hover:brightness-110";
	const disabledClasses = "cursor-not-allowed bg-white/10 text-[#a3a3a3]";

	return (
		<>
			{variants.length > 1 && <VariantSelector variants={variants} />}
			{description}
			<VolumePricingDisplay tiers={resolvedTiers} quantity={1} volumePrice={volumePrice} />
			{lowStock ? <p className="mb-4 text-sm text-amber">Only {lowStock} left in stock</p> : null}

			{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
			) : (
				<form onSubmit={handleSubmit}>
					{isOutOfStock ? (
						<button type="submit" disabled className={cn(buttonClasses, disabledClasses)}>
							Out of stock
						</button>
					) : (
						<button
							type="submit"
							disabled={!selectedVariant}
							aria-label={selectedVariant ? `Add to cart, ${product.name}` : "Select an option"}
							className={cn(buttonClasses, selectedVariant ? enabledClasses : disabledClasses)}
						>
							<Plus className="h-5 w-5" aria-hidden="true" />
							{selectedVariant ? "Add to cart" : "Select an option"}
						</button>
					)}
				</form>
			)}
		</>
	);
}
