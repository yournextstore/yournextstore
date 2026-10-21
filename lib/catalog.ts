import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { plainText } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

export type NavLink = { href: string; label: string };

export type CatalogEntry = {
	href: string;
	name: string;
	image: string | null;
	note: string | null;
};

const shortMoney = (formatted: string) => formatted.replace(/\.00(?=\D*$)/, "");

/** The store's own facts for the toolbar, features row and footer: nothing invented. */
export async function getStoreInfo() {
	"use cache";
	cacheLife("hours");
	const [me, { currency, locale }, socials] = await Promise.all([
		meGetCached().catch(() => null),
		getStoreConfig(),
		commerce.socialsGet().catch(() => null),
	]);
	const settings = me?.store.settings;
	const threshold = Number(settings?.freeShippingThreshold ?? 0);
	const tools = settings?.enabledTools;
	const socialLinks = Object.entries(socials?.socials ?? {})
		.filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].startsWith("http"))
		.map(([network, href]) => ({
			label: network === "x" ? "X" : network.charAt(0).toUpperCase() + network.slice(1),
			href,
		}));
	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		freeShipping: threshold ? shortMoney(formatMoney({ amount: BigInt(threshold), currency, locale })) : null,
		blog: tools?.blog ?? false,
		contact: tools?.contactForm ?? false,
		socialLinks,
	};
}

/**
 * The original's "Catalog" (categories with pictures and "from $X") maps to top-level categories;
 * a store without categories shows its collections instead, pictured by their own image.
 */
export async function getCatalogEntries(): Promise<CatalogEntry[]> {
	"use cache";
	cacheLife("hours");
	const [categories, collections, products, config] = await Promise.all([
		commerce.categoriesBrowse({ limit: 12 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [], meta: { count: 0 } })),
		getStoreConfig(),
	]);
	const { currency, locale, taxBehavior } = config;
	const fromPrice = (items: typeof products.data) => {
		// Unpriced variants (a set priced 0) would turn every "from" line into "from $0".
		const lows = items.flatMap((p) => {
			const priced = p.variants.filter((v) => BigInt(v.price) > 0n);
			return priced.length ? [priceRange(priced, taxBehavior).min] : [];
		});
		const low = lows.reduce<bigint | null>((acc, v) => (acc === null || v < acc ? v : acc), null);
		return low === null ? null : `from ${shortMoney(formatMoney({ amount: low, currency, locale }))}`;
	};
	const topCategories = categories.data.filter((c) => !c.parentId);
	if (topCategories.length > 0) {
		return topCategories.flatMap((category) => {
			const members = products.data.filter((p) => p.category?.id === category.id);
			if (members.length === 0) return [];
			return [
				{
					href: `/category/${category.slug}`,
					name: category.name.split(">").at(-1)?.trim() || category.name,
					image: category.image ?? members.find((p) => p.images[0])?.images[0] ?? null,
					note: fromPrice(members),
				},
			];
		});
	}
	// A manual collection with no members would open on an empty grid.
	const filled = collections.data.filter(
		(c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0,
	);
	return filled.map((collection) => ({
		href: `/collection/${collection.slug}`,
		name: collection.name,
		image: collection.image ?? null,
		note: plainText(collection.description) || null,
	}));
}

export async function getProductCount() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce
		.productBrowse({ active: true, limit: 1 })
		.catch(() => ({ data: [], meta: { count: 0 } }));
	return result.meta.count;
}

export async function getLatestProducts(limit: number) {
	"use cache";
	cacheLife("minutes");
	const result = await commerce
		.productBrowse({ active: true, limit: Math.max(limit, 24), orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [], meta: { count: 0 } }));
	// The newest pictured, priced products; unpriced or photo-less placeholders only as a fallback.
	const lead = (p: (typeof result.data)[number]) =>
		p.images.length > 0 && p.variants.some((v) => BigInt(v.price) > 0n);
	return [...result.data.filter(lead), ...result.data.filter((p) => !lead(p))].slice(0, limit);
}

export async function getProducts(limit: number) {
	"use cache";
	cacheLife("minutes");
	const result = await commerce
		.productBrowse({ active: true, limit: Math.max(limit, 24) })
		.catch(() => ({ data: [], meta: { count: 0 } }));
	// Pictured, priced products first, so grids never open on an empty frame or a zero price.
	const lead = (p: (typeof result.data)[number]) =>
		p.images.length > 0 && p.variants.some((v) => BigInt(v.price) > 0n);
	return [...result.data.filter(lead), ...result.data.filter((p) => !lead(p))].slice(0, limit);
}
