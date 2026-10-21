"use client";

import { CircleCheckBig, CircleX, ShoppingBag } from "lucide-react";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
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
	category?: { name: string; slug: string } | null;
	/** Server-rendered long description, shown under the summary in the Description block. */
	children?: React.ReactNode;
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	category,
	children,
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
		if (isOutOfStock) return "Out of Stock";
		return "Add to Cart";
	}, [selectedVariant, isOutOfStock]);

	const buttonLabel =
		selectedVariant && !isOutOfStock && totalPrice
			? `Add to Cart, ${formatMoney({ amount: totalPrice, currency, locale })}`
			: undefined;

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
			return { label: `Only ${stock} left in stock`, tone: "low" as const };
		}
		return { label: "In Stock", tone: "in" as const };
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

	const optionsText = selectedVariant?.combinations
		.map((c) => `${c.variantValue.variantType.label}: ${c.variantValue.value}`)
		.join(", ");

	return (
		<>
			{/* Price */}
			<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
				<span className="text-3xl font-bold text-ink">{priceInfo.display}</span>
				{priceInfo.compareAt && (
					<>
						<span className="text-xl text-muted-foreground line-through">{priceInfo.compareAt}</span>
						<span className="rounded bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
							Sale{priceInfo.discountPercent ? ` −${priceInfo.discountPercent}%` : ""}
						</span>
					</>
				)}
			</div>
			{omnibusPrice && (
				<p className="mt-2 text-xs text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
			)}

			{/* Stock status */}
			{stockStatus && (
				<div className="mt-4">
					<span
						className={cn(
							"inline-flex items-center gap-1.5",
							stockStatus.tone === "out" && "text-red-700",
							stockStatus.tone === "low" && "text-amber-700",
							stockStatus.tone === "in" && "text-success",
						)}
					>
						{stockStatus.tone === "out" ? (
							<CircleX className="size-5" aria-hidden />
						) : (
							<CircleCheckBig className="size-5" aria-hidden />
						)}
						{stockStatus.label}
					</span>
				</div>
			)}

			{variants.length > 1 && (
				<div className="mt-8">
					<VariantSelector variants={variants} />
				</div>
			)}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			<div className="mt-8">
				{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
					<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
				) : (
					<form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
						<QuantitySelector
							quantity={effectiveQuantity}
							onQuantityChange={setQuantity}
							max={Math.max(1, Math.min(99, maxQuantity))}
							disabled={isOutOfStock}
						/>
						<Button
							type="submit"
							size="lg"
							disabled={!selectedVariant || isOutOfStock}
							aria-label={buttonLabel}
						>
							{selectedVariant && !isOutOfStock && <ShoppingBag className="size-5" aria-hidden />}
							{buttonText}
						</Button>
					</form>
				)}
			</div>

			{(summary || children) && (
				<div className="mt-10 border-t border-border pt-8">
					<h2 className="mb-4 text-lg font-medium text-ink">Description</h2>
					{summary && <p className="whitespace-pre-line text-sm leading-6 text-ink-soft">{summary}</p>}
					{children}
				</div>
			)}

			<div className="mt-8 border-t border-border pt-8">
				<h2 className="mb-4 text-lg font-medium text-ink">Details</h2>
				<dl className="space-y-3 text-sm">
					{selectedVariant?.sku && (
						<div className="flex">
							<dt className="w-32 shrink-0 text-muted-foreground">SKU</dt>
							<dd className="min-w-0 break-words text-ink">{selectedVariant.sku}</dd>
						</div>
					)}
					{optionsText && (
						<div className="flex">
							<dt className="w-32 shrink-0 text-muted-foreground">Options</dt>
							<dd className="min-w-0 text-ink">{optionsText}</dd>
						</div>
					)}
					{category && (
						<div className="flex">
							<dt className="w-32 shrink-0 text-muted-foreground">Category</dt>
							<dd className="min-w-0">
								<Link
									href={`/category/${category.slug}`}
									className="text-ink underline-offset-4 hover:underline"
								>
									{category.name}
								</Link>
							</dd>
						</div>
					)}
					<div className="flex">
						<dt className="w-32 shrink-0 text-muted-foreground">Shipping</dt>
						<dd className="min-w-0 text-ink">Calculated at checkout</dd>
					</div>
				</dl>
			</div>
		</>
	);
}
