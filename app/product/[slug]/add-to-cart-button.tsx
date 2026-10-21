"use client";

import { ShieldCheckIcon, TruckIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
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
	/** Formatted free-shipping threshold from the store settings, if any. */
	freeShipping?: string | null;
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	freeShipping = null,
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
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

	const unitPrice = volumePrice ?? (selectedVariant ? displayPrice(selectedVariant, taxBehavior) : null);
	const totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;

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
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="space-y-5">
			{variants.length > 1 && <VariantSelector variants={variants} />}

			{/* UIkit "tm-product-info" price panel: tinted box, struck list price, price, qty + button. */}
			<div className="rounded-[4px] bg-tint p-5">
				{priceInfo.compareAt && (
					<del className="block text-uk-sm text-muted-foreground">{priceInfo.compareAt}</del>
				)}
				<div className="flex flex-wrap items-baseline gap-x-[10px]">
					<p className="text-[2rem] leading-tight font-medium text-foreground">{priceInfo.display}</p>
					{priceInfo.discountPercent ? (
						<span className="uk-label bg-sale">−{priceInfo.discountPercent}%</span>
					) : null}
				</div>
				{omnibusPrice && (
					<p className="mt-[5px] text-uk-xs text-muted-foreground">
						Lowest price in the last 30 days: {omnibusPrice}
					</p>
				)}

				<div className="mt-[15px]">
					{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
						<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
					) : (
						<form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-[10px]">
							<QuantitySelector
								quantity={effectiveQuantity}
								onQuantityChange={setQuantity}
								max={Math.max(1, Math.min(99, maxQuantity))}
								disabled={isOutOfStock}
							/>
							<button
								type="submit"
								disabled={!selectedVariant || isOutOfStock}
								className="uk-btn uk-btn-primary min-w-[150px] flex-1 whitespace-nowrap px-5"
								aria-label={
									totalPrice && selectedVariant && !isOutOfStock
										? `Add to cart, ${product.name}, ${formatMoney({ amount: totalPrice, currency, locale })}`
										: undefined
								}
							>
								{buttonText}
							</button>
						</form>
					)}
				</div>
			</div>

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			{/* Delivery panel (the template's "Delivery / Pick up from store" box). */}
			<ul className="space-y-[15px] rounded-[4px] bg-muted p-5">
				<li className="flex gap-[10px]">
					<TruckIcon aria-hidden className="mt-[2px] size-5 shrink-0 text-foreground" strokeWidth={1.25} />
					<div>
						<p className="text-uk-sm font-medium text-foreground">Delivery</p>
						<p className="text-uk-xs text-muted-foreground">
							{stockStatus?.tone === "out"
								? "Currently out of stock"
								: freeShipping
									? `In stock, free over ${freeShipping}`
									: "In stock, options at checkout"}
						</p>
					</div>
				</li>
				<li className="flex gap-[10px]">
					<ShieldCheckIcon
						aria-hidden
						className="mt-[2px] size-5 shrink-0 text-foreground"
						strokeWidth={1.25}
					/>
					<div>
						<p className="text-uk-sm font-medium text-foreground">Secure checkout</p>
						<p className="text-uk-xs text-muted-foreground">Cards and local payment methods</p>
					</div>
				</li>
			</ul>

			{/* Spec lines: "Label: value", as the template lists its short specs. */}
			<dl className="space-y-[5px] text-uk-sm">
				{stockStatus && (
					<div className="flex gap-[5px]">
						<dt className="text-muted-foreground">Availability:</dt>
						<dd
							className={cn(
								"text-foreground",
								stockStatus.tone === "out" && "text-destructive",
								stockStatus.tone === "low" && "text-[#a35400]",
							)}
						>
							{stockStatus.label}
						</dd>
					</div>
				)}
				{selectedVariant?.sku && (
					<div className="flex gap-[5px]">
						<dt className="text-muted-foreground">SKU:</dt>
						<dd className="text-foreground">{selectedVariant.sku}</dd>
					</div>
				)}
			</dl>
			{summary && <p className="text-uk-sm leading-relaxed whitespace-pre-line">{summary}</p>}
		</div>
	);
}
