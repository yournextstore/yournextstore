import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { richToText } from "@/lib/display";

export type BrowseProduct = APIProductsBrowseResult["data"][number];

/** The shop's display name: the settings name when set, else the store record. */
export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Your Next Store";
}

/** The whole (small) catalogue, newest first; sections slice and sort it themselves. */
export async function getCatalog(): Promise<BrowseProduct[]> {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit: 100, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] as BrowseProduct[] }));
	return data;
}

export async function getCategories() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.categoriesBrowse({ limit: 50 }).catch(() => ({ data: [] }));
	return data
		.filter((category) => category.active !== false && !category.parentId)
		.map((category) => ({
			id: category.id,
			name: category.name,
			slug: category.slug,
			image: category.image ?? null,
			description: richToText(category.description),
		}));
}

export async function getCollections() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] }));
	// A manual collection with no members would only lead to an empty page.
	const filled = data.filter(
		(collection) =>
			collection.productCollections.length > 0 ||
			(Array.isArray(collection.metafieldRules) && collection.metafieldRules.length > 0),
	);
	return filled.map((collection) => ({
		id: collection.id,
		name: collection.name,
		slug: collection.slug,
		image: collection.image ?? null,
		description: richToText(collection.description),
		productIds: collection.productCollections.map((entry) => entry.productId),
	}));
}

/**
 * Photographs for the editorial slots (banners, story tile, about grid). The original's are CMS
 * content we can't ship, so these are bundled AI-generated photographs (see NOTICE.md);
 * product tiles, product pages and the cart use the store's own images.
 */
export const EDITORIAL = {
	hero: "/images/pexels/hero-display.jpg",
	story: "/images/pexels/story-pool.jpg",
	shop: "/images/pexels/shop-chair.jpg",
	/** Collection and category banners when the merchant has not set an image. */
	banner: "/images/pexels/banner-purse.jpg",
	about: [
		"/images/pexels/about-grass.jpg",
		"/images/pexels/about-hoodie.jpg",
		"/images/pexels/about-sunglasses.jpg",
		"/images/pexels/about-bags.jpg",
	],
};

/** Products with a photograph (their own or a variant's) first, in their original order. */
export function picturedFirst<T extends { images?: readonly string[] | null; variants?: unknown }>(
	items: readonly T[],
): T[] {
	const pictured = (item: T) =>
		(item.images?.length ?? 0) > 0 ||
		(Array.isArray(item.variants) &&
			item.variants.some(
				(variant: unknown) =>
					typeof variant === "object" &&
					variant !== null &&
					"images" in variant &&
					Array.isArray(variant.images) &&
					variant.images.length > 0,
			));
	return [...items.filter(pictured), ...items.filter((item) => !pictured(item))];
}

export function pick<T>(list: T[], index: number): T | undefined {
	return list.length > 0 ? list[index % list.length] : undefined;
}
