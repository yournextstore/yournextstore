import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

export { modelCode, plateName } from "@/lib/rack-display";

type PricedVariant = { price: string; priceGross?: string | null; stock?: number | null };

export async function formatFromPrice(variants: PricedVariant[] | null | undefined) {
	if (!variants || variants.length === 0) return null;
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const { min, max } = priceRange(variants, taxBehavior);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
}

/** The module card's status tag: green when it ships, amber when it is running low or gone. */
export function stockTag(variants: PricedVariant[] | null | undefined): {
	label: string;
	tone: "ok" | "soon";
} {
	if (!variants || variants.length === 0) return { label: "unavailable", tone: "soon" };
	if (variants.every((v) => v.stock === 0)) return { label: "sold out", tone: "soon" };
	const tracked = variants.filter((v) => typeof v.stock === "number");
	const total = tracked.reduce((sum, v) => sum + (v.stock ?? 0), 0);
	if (tracked.length === variants.length && total <= 5) return { label: `${total} left`, tone: "soon" };
	return { label: "in stock", tone: "ok" };
}

/** One cached read of the catalogue for the home page sections. */
export async function getRackCatalog() {
	"use cache";
	cacheLife("minutes");
	const [products, me] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 24, orderBy: "createdAt", orderDirection: "desc" }),
		meGetCached().catch(() => null),
	]);
	const threshold = me?.store.settings?.freeShippingThreshold;
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const short = (amount: bigint) => formatMoney({ amount, currency, locale }).replace(/\.00(?=\D*$)/, "");
	const freeShipping = threshold && Number(threshold) > 0 ? short(BigInt(threshold)) : null;
	// $0 variants (an unpriced set) would print "Starts at $0".
	const allVariants = products.data.flatMap((p) => p.variants).filter((v) => Number(v.price) > 0);
	const range = allVariants.length > 0 ? priceRange(allVariants, taxBehavior) : null;
	return {
		products: products.data,
		productCount: products.meta.count,
		storeName: me?.store.name || "Your Next Store",
		storeDescription: me?.store.settings?.storeDescription || null,
		freeShipping,
		priceFrom: range ? short(range.min) : null,
		priceTo: range ? short(range.max) : null,
		currency,
	};
}

const minPrice = (variants: { price: string }[]) =>
	variants.reduce((min, v) => (Number(v.price) < min ? Number(v.price) : min), Number.POSITIVE_INFINITY);

/** Three "systems" from the catalogue: the entry piece, a mid pick and the top of the range. */
export function pickTiers<T extends { variants: { price: string }[] }>(products: T[]) {
	const priced = products.filter((p) => Number.isFinite(minPrice(p.variants)) && minPrice(p.variants) > 0);
	if (priced.length < 3) return [];
	const sorted = [...priced].sort((a, b) => minPrice(a.variants) - minPrice(b.variants));
	return [sorted[0], sorted[Math.floor(sorted.length / 2)], sorted[sorted.length - 1]].filter(
		(p): p is T => p !== undefined,
	);
}
