import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";

/** Flattens a TipTap document (or a plain string) into its visible text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value.trim();
	if (!value || typeof value !== "object") return "";
	const node = value as { type?: unknown; text?: unknown; content?: unknown };
	if (typeof node.text === "string") return node.text;
	const children = Array.isArray(node.content) ? node.content.map(richTextToPlain) : [];
	const inline = node.type === "paragraph" || node.type === "heading";
	return children
		.filter(Boolean)
		.join(inline ? "" : " ")
		.trim();
}

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

/** The store's name and one line about it, as the header, footer and hero print them. */
export async function getStoreBrand() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const name = me?.store.name || me?.store.settings?.storeName || "Your Next Store";
	const description = me?.store.settings?.storeDescription || "";
	const blog = me?.store.settings?.enabledTools?.blog ?? false;
	const contact = me?.store.settings?.enabledTools?.contactForm ?? false;
	// The small line under the wordmark: the store's own description when it is short enough to sit there.
	const tagline = description && description.length <= 48 ? description : "Good things, kept in one ledger.";
	return { name, description, blog, contact, tagline };
}

/** One cached browse of the catalog backs every section that needs products or a fallback image. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data, meta } = await commerce
		.productBrowse({ active: true, limit: 100, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [], meta: { count: 0 } }));
	return { products: data, total: meta.count };
}

export type ShowcaseTile = {
	id: string;
	name: string;
	slug: string;
	href: string;
	image: string | null;
	description: string;
	count: number;
};

/** Active collections with products, pictured by their own image or their first product's. */
export async function getCollectionTiles(limit = 50): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, { products }] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return collections.data
		.filter((collection) => collection.active)
		.map((collection) => {
			const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
			const members = products.filter((p) => memberIds.has(p.id));
			return {
				id: collection.id,
				name: collection.name,
				slug: collection.slug,
				href: `/collection/${collection.slug}`,
				image: collection.image ?? firstStill(members[0]?.images),
				description: richTextToPlain(collection.description),
				count: members.length,
			};
		})
		.filter((tile) => tile.count > 0 && tile.image)
		.slice(0, limit);
}

/** Top-level categories that have products, with how many each holds. */
export async function getCategoryTiles(limit = 50): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, { products }] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return categories.data
		.filter((category) => !category.parentId)
		.map((category) => {
			const members = products.filter((p) => p.category?.id === category.id);
			return {
				id: category.id,
				name: category.name,
				slug: category.slug,
				href: `/category/${category.slug}`,
				image: category.image ?? firstStill(members[0]?.images),
				description: richTextToPlain(category.description),
				count: members.length,
			};
		})
		.filter((tile) => tile.count > 0)
		.slice(0, limit);
}

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	tiktok: "TikTok",
	linkedin: "LinkedIn",
} as const;

export type SocialLink = { key: keyof typeof SOCIAL_LABELS; label: string; href: string };

/** The store's configured social profiles, in the original footer's order. */
export async function getSocialLinks(): Promise<SocialLink[]> {
	"use cache";
	cacheLife("hours");
	const socials = await commerce.socialsGet().catch(() => null);
	if (!socials) return [];
	return (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[]).flatMap((key) => {
		const href = socials.socials[key];
		return href ? [{ key, label: SOCIAL_LABELS[key], href }] : [];
	});
}

type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>["products"][number];

/** The product's lowest display price in minor units (net or gross per the store's tax behaviour). */
async function minPriceOf(product: CatalogProduct): Promise<bigint | null> {
	const { taxBehavior } = await getStoreConfig();
	// Free or unpriced variants (a $0 set) would print "from $0.00" on every price shelf.
	const priced = product.variants?.filter((variant) => Number(variant.price) > 0) ?? [];
	if (priced.length === 0) return null;
	return priceRange(priced, taxBehavior).min;
}

/** The house's numbers, from the catalogue: pieces, shelves, collections, options. */
export async function getLedgerStats() {
	"use cache";
	cacheLife("minutes");
	const [{ products, total }, categories, collections] = await Promise.all([
		getCatalogProducts(),
		getCategoryTiles(50),
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
	]);
	const options = products.reduce((sum, p) => sum + (p.variants?.length ?? 0), 0);
	return {
		pieces: total,
		shelves: categories.length,
		// A manual collection without members opens an empty page, so it is not counted.
		collections: collections.data.filter(
			(c) => c.active && ((c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0),
		).length,
		options,
	};
}

export type ClubTier = {
	name: string;
	who: string;
	from: string;
	to: string | null;
	fill: number;
	featured: boolean;
	href: string;
	cta: string;
	picks: { name: string; href: string; price: string }[];
};

const TIER_COPY = [
	{ name: "Folio", who: "For an ordinary weeknight bottle.", cta: "Begin with Folio", fill: 0.36 },
	{ name: "Shelf", who: "For the table when friends come round.", cta: "Open the Shelf", fill: 0.62 },
	{ name: "Ledger", who: "For the bottles you lay down for years.", cta: "Open the Ledger", fill: 0.86 },
] as const;

/**
 * The original's three wine-club allocations, retold as three price shelves of the real catalogue: the
 * lower, middle and upper third by price, each listing a few of its pieces and linking to the shelf.
 */
export async function getClubTiers(): Promise<ClubTier[]> {
	"use cache";
	cacheLife("minutes");
	const [{ products }, { currency, locale }] = await Promise.all([getCatalogProducts(), getStoreConfig()]);
	const priced = (
		await Promise.all(products.map(async (product) => ({ product, price: await minPriceOf(product) })))
	)
		.filter((entry): entry is { product: CatalogProduct; price: bigint } => entry.price !== null)
		.sort((a, b) => (a.price < b.price ? -1 : a.price > b.price ? 1 : 0));
	if (priced.length < 3) return [];

	const size = Math.ceil(priced.length / 3);
	const bands = [priced.slice(0, size), priced.slice(size, size * 2), priced.slice(size * 2)];
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	return bands.flatMap((band, index) => {
		const copy = TIER_COPY[index];
		const first = band[0];
		const last = band.at(-1);
		if (!copy || !first || !last) return [];
		const params = new URLSearchParams();
		if (index > 0) params.set("priceMin", String(first.price));
		if (index < 2) params.set("priceMax", String(last.price));
		params.set("sort", "price-asc");
		return [
			{
				name: copy.name,
				who: copy.who,
				from: fmt(first.price),
				to: first.price === last.price ? null : fmt(last.price),
				fill: copy.fill,
				featured: index === 1,
				href: `/products?${params.toString()}`,
				cta: copy.cta,
				picks: band.slice(0, index === 1 ? 4 : 3).map(({ product, price }) => ({
					name: product.name,
					href: `/product/${product.slug}`,
					price: fmt(price),
				})),
			},
		];
	});
}

/** Price bands for the "find your piece" chips: the club's thirds, as filter ranges. */
export async function getBudgetBands() {
	"use cache";
	cacheLife("minutes");
	const [{ products }, { currency, locale }] = await Promise.all([getCatalogProducts(), getStoreConfig()]);
	const prices = (await Promise.all(products.map(minPriceOf)))
		.filter((price): price is bigint => price !== null)
		.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
	if (prices.length < 3) return [];
	const lowCut = prices[Math.floor(prices.length / 3)];
	const highCut = prices[Math.floor((prices.length * 2) / 3)];
	if (lowCut === undefined || highCut === undefined || lowCut >= highCut) return [];
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	return [
		{ id: "low", label: `Under ${fmt(lowCut)}`, priceMax: String(lowCut - 1n) },
		{
			id: "mid",
			label: `${fmt(lowCut)} – ${fmt(highCut)}`,
			priceMin: String(lowCut),
			priceMax: String(highCut),
		},
		{ id: "high", label: `${fmt(highCut)} and up`, priceMin: String(highCut + 1n) },
	];
}

/**
 * Photographs for the hero and story slots: collection images first (on demo stores they are the
 * styled room shots), then each product's first still. `pick(i)` wraps, so a one-image store still
 * fills every slot.
 */
export async function getEditorialImages() {
	"use cache";
	cacheLife("minutes");
	const [collections, { products }] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const pool = [
		...collections.data.flatMap((c) => (c.active && c.image ? [c.image] : [])),
		...products.map((p) => firstStill(p.images)).filter((image): image is string => image !== null),
	];
	return [...new Set(pool)];
}

export const pick = (pool: readonly string[], i: number) =>
	pool.length > 0 ? (pool[i % pool.length] ?? null) : null;

export const pieces = (count: number) => (count === 1 ? "1 entry" : `${count} entries`);
