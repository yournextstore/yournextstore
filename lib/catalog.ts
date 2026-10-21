import { cacheLife } from "next/cache";
import { sentenceCase } from "@/lib/catalog-names";
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
	// The footer line: the store's own description when it is short enough to sit there.
	const tagline =
		description && description.length <= 160 ? description.trim() : "Good things, made to make you smile.";
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
				name: sentenceCase(collection.name),
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
				name: sentenceCase(category.name),
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

/** The numbers behind the shop report and the stats band, all read from the catalogue. */
export async function getShopReport() {
	"use cache";
	cacheLife("minutes");
	const [{ products, total }, categories, { currency, locale, taxBehavior }] = await Promise.all([
		getCatalogProducts(),
		getCategoryTiles(),
		getStoreConfig(),
	]);
	const allVariants = products.flatMap((p) => p.variants);
	const range = allVariants.length > 0 ? priceRange(allVariants, taxBehavior) : null;
	const money = (amount: bigint) => formatMoney({ amount: amount.toString(), currency, locale });
	const inStock = products.filter((p) => p.variants.some((v) => v.stock !== 0)).length;
	const photos = products.reduce((sum, p) => sum + p.images.filter((image) => !isVideoUrl(image)).length, 0);
	const variants = products.reduce((sum, p) => sum + p.variants.length, 0);
	const newest = products[0] ?? null;
	const biggest = [...categories].sort((a, b) => b.count - a.count)[0] ?? null;
	return {
		total: Math.max(total, products.length),
		inStock,
		photos,
		variants,
		sections: categories.length,
		biggest,
		minPrice: range ? money(range.min) : null,
		maxPrice: range ? money(range.max) : null,
		newest: newest ? { name: newest.name, href: `/product/${newest.slug}` } : null,
	};
}

export const pick = (pool: readonly string[], i: number) =>
	pool.length > 0 ? (pool[i % pool.length] ?? null) : null;

export const pieces = (count: number) => (count === 1 ? "1 piece" : `${count} pieces`);

export { sentenceCase };

export type ShowcaseProduct = {
	id: string;
	name: string;
	href: string;
	image: string;
	price: string | null;
	category: string | null;
};

/**
 * Products with a photograph, dealt round-robin across categories so neighbouring slots
 * (the hero pair, the flavour picker) show different kinds of thing. Stands in for the original's cans.
 */
export async function getShowcaseProducts(): Promise<ShowcaseProduct[]> {
	"use cache";
	cacheLife("minutes");
	const [{ products }, { currency, locale, taxBehavior }] = await Promise.all([
		getCatalogProducts(),
		getStoreConfig(),
	]);
	const pictured = products.flatMap((p) => {
		const image = firstStill(p.images);
		// Unpriced items (e.g. a set priced 0) would show "$0.00" in the hero and the picker.
		if (!image || !p.variants.some((v) => BigInt(v.price) > 0n)) return [];
		const range = p.variants.length > 0 ? priceRange(p.variants, taxBehavior) : null;
		return [
			{
				id: p.id,
				name: p.name,
				href: `/product/${p.slug}`,
				image,
				price: range ? formatMoney({ amount: range.min.toString(), currency, locale }) : null,
				category: p.category ? sentenceCase(p.category.name) : null,
				group: p.category?.id ?? "none",
			},
		];
	});
	const groups = [...new Set(pictured.map((p) => p.group))].map((group) =>
		pictured.filter((p) => p.group === group),
	);
	const depth = Math.max(0, ...groups.map((g) => g.length));
	return Array.from({ length: depth }, (_, row) => groups.flatMap((g) => (g[row] ? [g[row]] : []))).flatMap(
		(row) => row.map(({ group: _group, ...product }) => product),
	);
}

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** "four", "nine", "12": counts in headlines read as words, the way the original wrote "five flavors". */
export const countWord = (count: number) => NUMBER_WORDS[count] ?? String(count);
