import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

export type CatalogLink = { href: string; label: string };

const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

/** The store's display name: the name set in settings, else the store record's. */
export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Your Next Store";
}

/**
 * Header data. The original's top row lists the parent categories and its second bar lists
 * "All products" and the children of the active one; here the top row takes the first
 * top-level categories and the bar takes collections and the rest.
 */
export async function getNavData() {
	"use cache";
	cacheLife("hours");
	const [categories, collections, storeName, me] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 8 }).catch(() => ({ data: [] })),
		getStoreName(),
		meGetCached().catch(() => null),
	]);
	const topCategories: CatalogLink[] = categories.data
		.filter((category) => !category.parentId)
		.map((category) => ({ href: `/category/${category.slug}`, label: category.name }));
	const collectionLinks: CatalogLink[] = collections.data
		.filter((collection) => collection.active)
		.map((collection) => ({ href: `/collection/${collection.slug}`, label: collection.name }));
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;

	return {
		storeName,
		primary: topCategories.slice(0, 4),
		secondary: [...collectionLinks, ...topCategories.slice(4)],
		categories: topCategories,
		collections: collectionLinks,
		pages: [
			{ href: "/about", label: "About us" },
			...(blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
		],
	};
}

/** Category tiles for "Shop by category": each pictured by its first product's first still. */
export async function getCategoryTiles(limit = 8) {
	"use cache";
	cacheLife("minutes");
	const categories = await commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] }));
	const top = categories.data.filter((category) => !category.parentId).slice(0, limit);
	const tiles = await Promise.all(
		top.map(async (category) => {
			const products = await commerce
				.productBrowse({ active: true, category: category.slug, limit: 1 })
				.catch(() => ({ data: [] }));
			const image = category.image ?? firstStill(products.data[0]?.images);
			return {
				href: `/category/${category.slug}`,
				label: category.name,
				image,
				count: products.data.length,
			};
		}),
	);
	return tiles.filter((tile) => tile.count > 0 || tile.image);
}

/**
 * The dark "#COLLECTION" banner: the first non-empty collection, else the
 * first top-level category. Its photograph is the theme's own.
 */
export async function getFeaturedBanner() {
	"use cache";
	cacheLife("minutes");
	const [collections, categories] = await Promise.all([
		commerce.collectionBrowse({ limit: 8 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
	]);
	// Only a collection with something in it (members, or rules that select products).
	const collection = collections.data.find(
		(entry) =>
			entry.active && (entry.productCollections.length > 0 || (entry.metafieldRules?.length ?? 0) > 0),
	);
	if (collection) {
		return { tag: "Collection", name: collection.name, href: `/collection/${collection.slug}` };
	}
	const category = categories.data.find((entry) => !entry.parentId);
	if (category) {
		return {
			tag: "Category",
			name: category.name,
			href: `/category/${category.slug}`,
		};
	}
	return { tag: "Collection", name: "New in", href: "/products" };
}

/** "Shop by style": collections when the store has them, else its top-level categories. */
export async function getStyleLinks() {
	"use cache";
	cacheLife("minutes");
	const { collections, categories } = await getNavData();
	return {
		title: collections.length > 0 ? "Shop by style" : "Shop by range",
		links: (collections.length > 0 ? collections : categories).slice(0, 5),
	};
}

/** Collection descriptions are TipTap JSON; the header wants their plain text. */
export function flattenRichText(value: unknown): string {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map(flattenRichText).join(" ");
	if (value && typeof value === "object") {
		const node = value as { text?: unknown; content?: unknown };
		return typeof node.text === "string" ? node.text : flattenRichText(node.content);
	}
	return "";
}
