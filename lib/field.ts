import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

/** Spec-sheet model code from a product name: "Blaze Torch" → "BT". The index makes it unique on a page. */
export function modelCode(name: string, index?: number) {
	const letters =
		name
			.split(/[\s-]+/)
			.filter(Boolean)
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.replace(/[^A-Z0-9]/g, "")
			.slice(0, 3) || "FS";
	return index === undefined ? letters : `${letters}-${String(index + 1).padStart(2, "0")}`;
}

/** Grid references for the eyebrows: real-world ridges, purely decorative. */
export const GRID_REFS = [
	"46.55°N / 7.98°E",
	"27.99°N / 86.93°E",
	"61.22°N / 149.90°W",
	"44.27°N / 71.30°W",
	"78.22°N / 15.65°E",
	"90.00°S / 0.00°E",
] as const;

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
	if (variants.every((v) => v.stock === 0)) return "Out of stock";
	const tracked = variants.filter((v) => typeof v.stock === "number");
	const total = tracked.reduce((sum, v) => sum + (v.stock ?? 0), 0);
	if (tracked.length === variants.length && total <= 5) return `${total} left`;
	return "In stock";
}

/** A manual collection without members opens an empty page, so it is never linked. */
export const hasMembers = (c: {
	productCollections?: readonly unknown[] | null;
	metafieldRules?: readonly unknown[] | null;
}) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0;

/** One cached read of the catalogue for the home page sections. */
export async function getFieldCatalog() {
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
			? formatMoney({ amount: BigInt(threshold), currency, locale }).replace(/\.00(?=\D*$)/, "")
			: null;
	// Pictured, priced products lead every row; image-less or zero-priced ones go last.
	const shown = (p: (typeof products.data)[number]) =>
		(p.images?.length ?? 0) > 0 && p.variants.some((v) => Number(v.price) > 0) ? 0 : 1;
	const ordered = products.data
		.map((product, index) => ({ product, index }))
		.sort((a, b) => shown(a.product) - shown(b.product) || a.index - b.index)
		.map(({ product }) => product);
	return {
		products: ordered,
		productCount: products.meta.count,
		collections: collections.data.filter(hasMembers),
		storeName: me?.store.name || "Field Supply",
		storeDescription: me?.store.settings?.storeDescription || null,
		freeShipping,
	};
}

const minPrice = (variants: { price: string }[]) =>
	variants.reduce((min, v) => (Number(v.price) < min ? Number(v.price) : min), Number.POSITIVE_INFINITY);

/** Three tiers from the catalogue: the lightest entry, a mid pick and the top of the range. */
export function pickTiers<T extends { variants: PricedVariant[]; images?: string[] | null }>(products: T[]) {
	// Only pictured, buyable products with a real price make a tier (a $0 set, an image-less bundle or a sold-out item would not).
	const eligible = products.filter(
		(p) => (p.images?.length ?? 0) > 0 && minPrice(p.variants) > 0 && !p.variants.every((v) => v.stock === 0),
	);
	if (eligible.length < 3) return [];
	const sorted = [...eligible].sort((a, b) => minPrice(a.variants) - minPrice(b.variants));
	return [sorted[0], sorted[Math.floor(sorted.length / 2)], sorted[sorted.length - 1]].filter(
		(p): p is T => p !== undefined,
	);
}
