"use client";

import { MinusIcon, PlusIcon, ShoppingBasketIcon, XIcon } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { toast } from "sonner";
import { addToCart, setCartQuantity } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { Separator } from "@/components/separator";
import { useStoreConfig } from "@/components/store-config-provider";
import { Badge } from "@/components/ui/badge";
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
	/** Server-rendered meta rows (category) placed above the availability row. */
	meta?: ReactNode;
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	meta,
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { items, openCart, dispatch, syncCart, reconcile, startMutation, isMutating } = useCart();

	const selectedVariant = useSelectedVariant(variants);

	// stock === null means stock isn't tracked for this variant (unlimited)
	const isOutOfStock = selectedVariant?.stock === 0;
	const maxQuantity = selectedVariant?.stock ?? 99;
	const effectiveQuantity = 1;

	const { resolvedTiers, volumePrice } = useVolumePricing(
		volumePricingTiers,
		selectedVariant?.id,
		effectiveQuantity,
		taxBehavior,
	);

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

	const inCart = items.find((item) => item.productVariant.id === selectedVariant?.id)?.quantity ?? 0;

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

		if (previousQuantity === 0) openCart();

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

	// The original's in-cart stepper: once the item is in the cart the button becomes − / count / +.
	const handleDecrement = () => {
		if (!selectedVariant || inCart === 0) return;
		const variantId = selectedVariant.id;
		dispatch(inCart <= 1 ? { type: "REMOVE", variantId } : { type: "DECREASE", variantId });
		startMutation(async () => {
			const result = await setCartQuantity(variantId, inCart - 1);
			if (result.success && result.cart) {
				syncCart(result.cart);
			} else {
				await reconcile();
			}
		});
	};

	return (
		<>
			<div className="space-y-2">
				{meta}
				{stockStatus && (
					<div className="flex items-center gap-2">
						<p className="text-sm">Availability:</p>
						<Badge
							variant={stockStatus.tone === "out" ? "secondary" : "outline"}
							className={cn(stockStatus.tone === "out" && "text-muted-foreground")}
						>
							{stockStatus.label}
						</Badge>
					</div>
				)}
				{selectedVariant?.sku && (
					<div className="flex items-center gap-2">
						<p className="text-sm">SKU:</p>
						<Badge variant="outline">{selectedVariant.sku}</Badge>
					</div>
				)}
			</div>
			{summary && (
				<>
					<Separator />
					<p className="text-sm leading-relaxed whitespace-pre-line">{summary}</p>
				</>
			)}
			<Separator />
			<div className="block space-y-4">
				<div className="space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						{priceInfo.compareAt ? (
							<Badge className="flex gap-3 border-transparent bg-sale text-white">
								<span className="line-through">{priceInfo.compareAt}</span>
								{priceInfo.discountPercent ? <span>-{priceInfo.discountPercent}%</span> : null}
							</Badge>
						) : null}
						<p className="text-xl">{priceInfo.display}</p>
					</div>
					{omnibusPrice && (
						<p className="text-xs text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
					)}
				</div>

				{variants.length > 1 && <VariantSelector variants={variants} />}

				<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

				{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
					<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
				) : (
					<form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
						{inCart > 0 && !isOutOfStock ? (
							<>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={handleDecrement}
									aria-label={inCart === 1 ? "Remove from cart" : "Decrease quantity in cart"}
								>
									{inCart === 1 ? (
										<XIcon className="h-4" aria-hidden />
									) : (
										<MinusIcon className="h-4" aria-hidden />
									)}
								</Button>
								<output
									aria-live="polite"
									aria-label={`${inCart} in cart`}
									className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-input px-2 text-sm font-medium tabular-nums opacity-80"
								>
									{inCart}
								</output>
								<Button
									type="submit"
									variant="outline"
									size="icon"
									disabled={selectedVariant?.stock !== null && inCart >= maxQuantity}
									aria-label="Increase quantity in cart"
								>
									<PlusIcon className="h-4" aria-hidden />
								</Button>
								<button
									type="button"
									onClick={openCart}
									disabled={isMutating}
									className="ml-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
								>
									View cart
								</button>
							</>
						) : (
							<Button type="submit" disabled={!selectedVariant || isOutOfStock} className="font-medium">
								<ShoppingBasketIcon className="h-4" aria-hidden />
								{!selectedVariant ? "Select options" : isOutOfStock ? "Out of stock" : "Add to Cart"}
							</Button>
						)}
					</form>
				)}
			</div>
		</>
	);
}
