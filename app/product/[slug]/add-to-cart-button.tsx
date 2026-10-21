"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { pill } from "@/components/munch/styles";
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
	const buttonRef = useRef<HTMLButtonElement>(null);
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
	const _totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

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

	const outOfStockOrMissing = !selectedVariant || isOutOfStock;

	return (
		<div className="flex flex-col gap-lg">
			<div className="flex flex-col gap-1">
				<p className="flex flex-wrap items-baseline gap-x-3 text-b-lg leading-[1.5] lg:text-b-xl">
					<span>{priceInfo.display}</span>
					{priceInfo.compareAt && <s className="text-b-md opacity-80">{priceInfo.compareAt}</s>}
					{priceInfo.discountPercent ? (
						<span className="font-display-d bg-blush px-1 text-l-xs">−{priceInfo.discountPercent}%</span>
					) : null}
				</p>
				{omnibusPrice && <p className="text-b-xs">Lowest price in the last 30 days: {omnibusPrice}</p>}
				{stockStatus && stockStatus.tone !== "in" && <p className="text-b-sm">{stockStatus.label}</p>}
			</div>

			{summary && (
				<p className="text-b-md leading-[1.5] font-normal whitespace-pre-line lg:text-b-lg">{summary}</p>
			)}

			<div className="mt-s flex flex-col gap-s">
				{variants.length > 1 && <VariantSelector variants={variants} />}

				<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

				{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
					<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
				) : (
					<form id="pdp-atc" onSubmit={handleSubmit}>
						<button
							ref={buttonRef}
							type="submit"
							disabled={outOfStockOrMissing}
							className={pill({ size: "xl", variant: "outline", className: "w-full" })}
						>
							{buttonText}
						</button>
					</form>
				)}
			</div>
			<StickyAddToCart target={buttonRef} label={buttonText} disabled={outOfStockOrMissing} />
		</div>
	);
}

/**
 * The original's phone-only bar: a tomato pill docked to the bottom while the page's own button is
 * scrolled away, hidden again once the footer arrives. It submits the same form.
 */
function StickyAddToCart({
	target,
	label,
	disabled,
}: {
	target: React.RefObject<HTMLButtonElement | null>;
	label: string;
	disabled: boolean;
}) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const button = target.current;
		const footer = document.querySelector("footer");
		if (!button) return;
		let buttonInView = true;
		let footerInView = false;
		const update = () => setVisible(!buttonInView && !footerInView);
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === button) buttonInView = entry.isIntersecting;
				else footerInView = entry.isIntersecting;
			}
			update();
		});
		observer.observe(button);
		if (footer) observer.observe(footer);
		return () => observer.disconnect();
	}, [target]);

	return (
		<div
			data-sticky-atc={visible ? "on" : "off"}
			inert={!visible}
			className={cn(
				"fixed inset-x-0 bottom-0 z-40 border-t border-brand bg-background p-m transition-transform duration-300 lg:hidden",
				visible ? "translate-y-0" : "translate-y-full",
			)}
		>
			<button
				type="submit"
				form="pdp-atc"
				disabled={disabled}
				className={pill({ size: "md", variant: "primary", className: "mx-auto h-15" })}
			>
				{label}
			</button>
		</div>
	);
}
