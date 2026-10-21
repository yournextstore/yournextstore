"use client";

import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { useStoreConfig } from "@/components/store-config-provider";
import { gfGreenPill, gfGreyPill, gfStepButton } from "@/lib/gf-styles";
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
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
}: AddToCartButtonProps) {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const [quantity, setQuantity] = useState(1);
	const { items, openCart, dispatch, syncCart, reconcile, startMutation } = useCart();

	const selectedVariant = useSelectedVariant(variants);

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
		return "Add to cart";
	}, [selectedVariant, isOutOfStock]);

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

	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	// "Buy now" from the original's add-to-cart sheet: same write, then straight to checkout
	// once the server has the line (a full navigation, /checkout is a proxied zone).
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const submitter = (e.nativeEvent as SubmitEvent).submitter;
		const buyNow = submitter instanceof HTMLButtonElement && submitter.value === "buy";

		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;

		trackAddToCart(selectedVariant, product.name, addedQuantity);

		if (!buyNow) {
			openCart();
		}
		setQuantity(1);

		// Instant local feedback OUTSIDE the transition, then REPLACE with the
		// server-returned cart (never refetch — cartGet reads a replica that can lag
		// the write).
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: addedQuantity,
				productVariant: {
					id: variantId,
					price: selectedVariant.price,
					// Carry the gross twin so the optimistic line renders in the same basis the
					// server-returned cart will use — no net/gross flip while the write is in flight.
					priceGross: selectedVariant.priceGross,
					images: selectedVariant.images,
					product,
				},
			},
		});

		startMutation(async () => {
			// The server clamps line quantities to available stock and still responds
			// with the updated cart — sync from the RETURNED cart; reconcile only on failure.
			const result = await addToCart(variantId, addedQuantity);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
				if (line.quantity < previousQuantity + addedQuantity) {
					toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
				}
				if (buyNow) {
					window.location.assign(checkoutUrl);
				}
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	const maxSelectable = Math.max(1, Math.min(99, maxQuantity));

	return (
		<div className="space-y-6">
			{/* Price on the left, the round −/+ counter on the right: the original's add-to-cart sheet. */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-col gap-[5px]">
					<div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
						<span className="text-gf-h3 font-bold">{priceInfo.display}</span>
						{priceInfo.compareAt && <s className="text-gf-h6 text-muted-foreground">{priceInfo.compareAt}</s>}
						{priceInfo.discountPercent ? (
							<span className="rounded-full bg-green-500 px-2 py-[3px] text-gf-xs font-bold text-white">
								-{priceInfo.discountPercent}%
							</span>
						) : null}
					</div>
					{/* Always one line tall: before the variant lands in the URL there is no status yet. */}
					{!stockStatus && <span className="h-[18px]" aria-hidden="true" />}
					{stockStatus && (
						<span
							className={cn(
								"inline-flex h-[18px] items-center gap-1.5 text-gf-h6",
								stockStatus.tone === "out" && "text-destructive",
								stockStatus.tone === "low" && "text-orange-700",
								stockStatus.tone === "in" && "text-green-500",
							)}
						>
							<span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
							{stockStatus.label}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2.5">
					<button
						type="button"
						className={cn(gfStepButton, "size-11")}
						onClick={() => setQuantity(Math.max(1, effectiveQuantity - 1))}
						disabled={isOutOfStock || effectiveQuantity <= 1}
						aria-label="Decrease quantity"
					>
						<Minus className="size-4" />
					</button>
					<output
						aria-live="polite"
						aria-label="Quantity"
						className="min-w-5 text-center text-gf-h5 font-bold tabular-nums"
					>
						{effectiveQuantity}
					</output>
					<button
						type="button"
						className={cn(gfStepButton, "size-11")}
						onClick={() => setQuantity(Math.min(maxSelectable, effectiveQuantity + 1))}
						disabled={isOutOfStock || effectiveQuantity >= maxSelectable}
						aria-label="Increase quantity"
					>
						<Plus className="size-4" />
					</button>
				</div>
			</div>

			{omnibusPrice && (
				<p className="text-gf-sm text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
			)}

			{variants.length > 1 && <VariantSelector variants={variants} />}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
			) : (
				<form onSubmit={handleSubmit} className="flex items-center gap-2.5">
					<button
						type="submit"
						value="add"
						disabled={!selectedVariant || isOutOfStock}
						className={cn(gfGreyPill, "h-[50px] gf-shadow")}
					>
						{buttonText}
					</button>
					<button
						type="submit"
						value="buy"
						disabled={!selectedVariant || isOutOfStock}
						className={cn(gfGreenPill, "h-[50px]")}
					>
						Buy now
					</button>
				</form>
			)}

			{summary && (
				<section className="rounded-[30px] bg-flash-white p-5">
					<h2 className="text-gf-h5 font-bold">About this product</h2>
					<p className="mt-2 whitespace-pre-line text-gf-h6 leading-[1.55] text-muted-foreground">
						{summary}
					</p>
				</section>
			)}
		</div>
	);
}
