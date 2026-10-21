import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

/** Model code from a product name, like the original's "MK-01": "Azure Drift" → "AD-01". */
export function modelCode(name: string, index?: number) {
	const letters =
		name
			.split(/[\s-]+/)
			.filter(Boolean)
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.replace(/[^A-Z0-9]/g, "")
			.slice(0, 3) || "MK";
	return index === undefined ? letters : `${letters}-${String(index + 1).padStart(2, "0")}`;
}

type PricedVariant = { price: string; priceGross?: string | null; stock?: number | null };

export async function formatFromPrice(variants: PricedVariant[] | null | undefined) {
	if (!variants || variants.length === 0) return null;
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const { min, max } = priceRange(variants, taxBehavior);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
}

export function stockLabel(variants: PricedVariant[] | null | undefined) {
	if (!variants || variants.length === 0) return "—";
	if (variants.every((v) => v.stock === 0)) return "Sold out";
	const tracked = variants.filter((v) => typeof v.stock === "number");
	const total = tracked.reduce((sum, v) => sum + (v.stock ?? 0), 0);
	if (tracked.length === variants.length && total <= 5) return `${total} left`;
	return "In stock";
}

/** One cached read of the catalogue for the home page sections. */
export async function getCatalog() {
	"use cache";
	cacheLife("minutes");
	const [products, collections, me] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 24, orderBy: "createdAt", orderDirection: "desc" }),
		commerce.collectionBrowse({ limit: 6 }),
		meGetCached().catch(() => null),
	]);
	const threshold = me?.store.settings?.freeShippingThreshold;
	const { currency, locale } = await getStoreConfig();
	const freeShipping =
		threshold && Number(threshold) > 0
			? formatMoney({ amount: BigInt(threshold), currency, locale }).replace(/[.,]00(?=\D*$)/, "")
			: null;
	return {
		products: products.data,
		productCount: products.meta.count,
		collections: collections.data,
		storeName: me?.store.name || "Your Next Store",
		storeDescription: me?.store.settings?.storeDescription || null,
		freeShipping,
	};
}

const minPrice = (variants: { price: string }[]) =>
	variants.reduce((min, v) => (Number(v.price) < min ? Number(v.price) : min), Number.POSITIVE_INFINITY);

/** Three tiers from the catalogue: the lightest entry, a mid pick and the top of the range. */
export function pickTiers<T extends { variants: { price: string }[] }>(products: T[]) {
	// $0 entries (an unpriced set) would read as the cheapest tier.
	const priced = products.filter((p) => minPrice(p.variants) > 0 && Number.isFinite(minPrice(p.variants)));
	if (priced.length < 3) return [];
	const sorted = [...priced].sort((a, b) => minPrice(a.variants) - minPrice(b.variants));
	return [sorted[0], sorted[Math.floor(sorted.length / 2)], sorted[sorted.length - 1]].filter(
		(p): p is T => p !== undefined,
	);
}
