import { cacheLife } from "next/cache";
import { hasMembers } from "@/lib/aqua";
import { commerce } from "@/lib/commerce";

// Plain module on purpose: listing pages (server) and nothing client-side share these, so they
// never cross a "use client" boundary as a reference proxy.

export type ListingSort = {
	title: string;
	slug: string | null;
	orderBy?: "createdAt" | "price" | "name";
	orderDirection?: "asc" | "desc";
};

export const DEFAULT_SORT: ListingSort = { title: "Relevance", slug: null };

export const LISTING_SORTS: ListingSort[] = [
	DEFAULT_SORT,
	{ title: "Latest arrivals", slug: "latest-desc", orderBy: "createdAt", orderDirection: "desc" },
	{ title: "Price: Low to high", slug: "price-asc", orderBy: "price", orderDirection: "asc" },
	{ title: "Price: High to low", slug: "price-desc", orderBy: "price", orderDirection: "desc" },
	{ title: "Name: A to Z", slug: "name-asc", orderBy: "name", orderDirection: "asc" },
];

export function getListingSort(slug: string | undefined) {
	return LISTING_SORTS.find((sort) => sort.slug === slug) ?? DEFAULT_SORT;
}

export function sortBrowseParams(sort: ListingSort) {
	return sort.orderBy ? { orderBy: sort.orderBy, orderDirection: sort.orderDirection } : {};
}

type SortableProduct = {
	name: string;
	createdAt?: string | Date;
	variants?: ReadonlyArray<{ price: string }>;
};

const minPrice = (product: SortableProduct) =>
	(product.variants ?? []).reduce<number>(
		(min, variant) => Math.min(min, Number(variant.price)),
		Number.POSITIVE_INFINITY,
	);

/** Collection members arrive as one list; sort them the way the browse API would. */
export function sortProducts<T extends SortableProduct>(products: T[], sort: ListingSort): T[] {
	if (!sort.orderBy) {
		return products;
	}
	const direction = sort.orderDirection === "desc" ? -1 : 1;
	const key = (product: T) => {
		if (sort.orderBy === "price") return minPrice(product);
		if (sort.orderBy === "createdAt") return new Date(product.createdAt ?? 0).getTime();
		return 0;
	};
	return products.toSorted((a, b) =>
		sort.orderBy === "name" ? a.name.localeCompare(b.name) * direction : (key(a) - key(b)) * direction,
	);
}

export type ListingLink = { title: string; path: string };

/** The listing sidebar: every collection and top-level category, as the reference's "Collections" list. */
export async function getListingNav() {
	"use cache";
	cacheLife("hours");
	const [collections, categories] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
	]);
	return {
		collections: collections.data
			.filter(hasMembers)
			.map((c): ListingLink => ({ title: c.name, path: `/collection/${c.slug}` })),
		categories: categories.data
			.filter((c) => !c.parentId)
			.map((c): ListingLink => ({ title: c.name, path: `/category/${c.slug}` })),
	};
}

/** Store display name: `settings.storeName` when set, else the store's own name. */
export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await commerce.meGet().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Store";
}

/** The reference's price facets, in minor units (net, as the browse API filters). */
export type PriceBucket = { slug: string; min?: number; max?: number };

export const PRICE_BUCKETS: PriceBucket[] = [
	{ slug: "under-30", max: 3000 },
	{ slug: "30-50", min: 3000, max: 5000 },
	{ slug: "50-100", min: 5000, max: 10000 },
	{ slug: "100-plus", min: 10000 },
];

export function getPriceBucket(slug: string | undefined) {
	return PRICE_BUCKETS.find((bucket) => bucket.slug === slug);
}

/** Browse params for a bucket; the API's max is inclusive, so step one minor unit below it. */
export function priceBrowseParams(bucket: PriceBucket | undefined) {
	return bucket
		? { priceMin: bucket.min, priceMax: bucket.max === undefined ? undefined : bucket.max - 1 }
		: {};
}

/** Cheapest variant price (net minor units) of a product, for in-memory facets. */
export function lowestPrice(product: { variants?: ReadonlyArray<{ price: string }> }) {
	return (product.variants ?? []).reduce<number>(
		(min, variant) => Math.min(min, Number(variant.price)),
		Number.POSITIVE_INFINITY,
	);
}

export function inBucket(price: number, bucket: PriceBucket | undefined) {
	return !bucket || (price >= (bucket.min ?? 0) && (bucket.max === undefined || price < bucket.max));
}
