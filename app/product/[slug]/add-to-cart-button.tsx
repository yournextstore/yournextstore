"use client";

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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { summaryParagraphs } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";

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

	// A long description shows its first paragraphs; the rest goes in the disclosure.
	const paragraphs = summaryParagraphs(summary, product.name);
	const intro = paragraphs.slice(0, 3);
	const details = paragraphs.slice(3);

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

	// The original's product panel: price under the title, the description, the option pickers,
	// then one row with the indigo "Add to cart" bar and the bordered quantity box.
	return (
		<div>
			<div className="mt-3">
				<h2 className="sr-only">Product information</h2>
				<p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span className="text-3xl tracking-tight text-[#111827]">{priceInfo.display}</span>
					{priceInfo.compareAt && (
						<span className="text-lg text-muted-foreground line-through">{priceInfo.compareAt}</span>
					)}
				</p>
				{omnibusPrice && (
					<p className="mt-2 text-xs text-muted-foreground">
						Lowest price in the last 30 days: {omnibusPrice}
					</p>
				)}
			</div>

			{intro.length > 0 ? (
				<div className="mt-6 text-base leading-7 text-[#374151]">
					<Paragraphs paragraphs={intro} />
				</div>
			) : null}

			{variants.length > 1 && (
				<div className="mt-8">
					<VariantSelector variants={variants} />
				</div>
			)}

			{stockStatus?.tone === "low" ? (
				<p className="mt-6 text-sm font-medium text-amber-700">{stockStatus.label}</p>
			) : null}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
				<div className="mt-10">
					<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
				</div>
			) : (
				<form
					onSubmit={handleSubmit}
					className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-stretch"
				>
					<button
						type="submit"
						disabled={!selectedVariant || isOutOfStock}
						className="flex h-12 w-full items-center justify-center bg-indigo px-8 text-base font-medium text-white transition-colors hover:bg-indigo-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-xs sm:flex-1"
					>
						{buttonText}
					</button>
					<QuantitySelector
						quantity={effectiveQuantity}
						onQuantityChange={setQuantity}
						max={Math.max(1, Math.min(99, maxQuantity))}
						disabled={isOutOfStock}
					/>
				</form>
			)}

			{/* The original closes the panel with a "Size Chart" disclosure; long catalogue descriptions
			    keep their intro above the options and fold the rest in here. */}
			{details.length > 0 ? (
				<section aria-labelledby="more-details-heading" className="mt-12">
					<h2 id="more-details-heading" className="sr-only">
						More details
					</h2>
					<Accordion type="single" collapsible className="border-t border-border">
						<AccordionItem value="more">
							<AccordionTrigger>More details</AccordionTrigger>
							<AccordionContent className="text-base leading-7 text-[#374151]">
								<Paragraphs paragraphs={details} />
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</section>
			) : null}
		</div>
	);
}

function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
	return paragraphs.map((paragraph, index) => (
		<p key={`${index}-${paragraph.slice(0, 16)}`} className={index === 0 ? "mt-0" : "mt-5"}>
			{paragraph}
		</p>
	));
}
