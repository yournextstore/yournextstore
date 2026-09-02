/**
 * Tax-behavior-aware price selection.
 *
 * Prices are STORED net. The API also returns a gross twin for every net price field
 * (`price` → `priceGross`, `originalPrice` → `originalPriceGross`, …). The store's
 * `taxBehavior` decides which of the two a shopper is supposed to see:
 *
 *   shown = taxBehavior === "inclusive" ? variant.priceGross : variant.price
 *
 * That single rule is the whole module. Everything here is pure: pick a field, never
 * compute tax. When a gross twin is missing (an older API payload, or a nested shape
 * the API does not gross up yet) the net value is returned instead, so a storefront
 * on an older backend degrades to today's behaviour rather than rendering nothing.
 */

export type TaxBehavior = "inclusive" | "exclusive";

/** Net price fields that have a `${field}Gross` twin. */
export type PriceField = "price" | "originalPrice" | "calculatedPrice" | "prePromotionPrice" | "omnibusPrice";

/** Any object carrying (some of) the net price fields and their gross twins. */
export type PriceSource = {
	readonly [K in PriceField | `${PriceField}Gross`]?: string | null;
};

/** A price source that is guaranteed to carry an effective `price`. */
export type PricedVariant = PriceSource & { readonly price: string };

export type VolumePricingTier = { readonly price: string; readonly priceGross?: string | null };

/** Cart/order money totals as the API returns them (minor units, `null` under Stripe Tax). */
export type TotalsSource = {
	readonly subtotal?: number | null;
	readonly subtotalNet?: number | null;
	readonly subtotalGross?: number | null;
};

export function displayPrice(variant: PricedVariant, taxBehavior: TaxBehavior, field?: "price"): string;
export function displayPrice(
	variant: PriceSource,
	taxBehavior: TaxBehavior,
	field: PriceField,
): string | null;
export function displayPrice(variant: PriceSource, taxBehavior: TaxBehavior, field: PriceField = "price") {
	const net = variant[field] ?? null;
	if (net === null || taxBehavior !== "inclusive") {
		return net;
	}
	return variant[`${field}Gross`] ?? net;
}

/**
 * The same pick as {@link displayPrice}, for a net/gross pair that does not travel as one object —
 * a product's bundle pricing fields, say, where the twins sit side by side on the product
 * (`bundleFixedPriceAmount` / `bundleFixedPriceAmountGross`). `null` net stays `null`; a missing
 * gross twin degrades to net, exactly as the field-based helper does.
 */
export function displayAmount(
	net: string | null | undefined,
	gross: string | null | undefined,
	taxBehavior: TaxBehavior,
) {
	if (net === null || net === undefined) {
		return null;
	}
	return taxBehavior === "inclusive" ? (gross ?? net) : net;
}

/** The per-unit price of a volume-pricing tier, in the basis the shopper should see. */
export function displayTierPrice(tier: VolumePricingTier, taxBehavior: TaxBehavior) {
	return taxBehavior === "inclusive" ? (tier.priceGross ?? tier.price) : tier.price;
}

/**
 * Cheapest and dearest displayed price across a set of variants. Returns `{ min: 0n, max: 0n }`
 * for an empty list — callers that render a range must check the list themselves.
 */
export function priceRange(
	variants: readonly PricedVariant[],
	taxBehavior: TaxBehavior,
	field?: "price",
): { min: bigint; max: bigint };
export function priceRange(
	variants: readonly PriceSource[],
	taxBehavior: TaxBehavior,
	field: PriceField,
): { min: bigint; max: bigint };
export function priceRange(
	variants: readonly PriceSource[],
	taxBehavior: TaxBehavior,
	field: PriceField = "price",
) {
	const amounts = variants
		.map((variant) => displayPrice(variant, taxBehavior, field))
		.filter((value): value is string => value !== null)
		.map((value) => BigInt(value));

	const first = amounts[0] ?? BigInt(0);
	return amounts.reduce(
		(range, amount) => ({
			min: amount < range.min ? amount : range.min,
			max: amount > range.max ? amount : range.max,
		}),
		{ min: first, max: first },
	);
}

/**
 * The subtotal a shopper should see, taken from the API's own totals (minor units).
 * `null` when the store computes tax at checkout (Stripe Tax) or the cart carries no
 * totals — callers then fall back to summing display prices locally.
 */
export function cartDisplaySubtotal(
	cart: TotalsSource | null | undefined,
	taxBehavior: TaxBehavior,
): number | null {
	if (!cart) {
		return null;
	}
	const sided = taxBehavior === "inclusive" ? cart.subtotalGross : cart.subtotalNet;
	return sided ?? cart.subtotal ?? null;
}
