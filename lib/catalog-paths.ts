import { cacheLife } from "next/cache";
import { tagKinds } from "@/lib/cache-tags";
import { commerce } from "@/lib/commerce";
import { isHiddenFromSearch } from "@/lib/hidden-from-search";

// Every catalog address, for app/sitemap.ts and for `generateStaticParams`: known pages prerender completely
// (no loading states), and an address added later renders on its first visit and is cached from then on.

/** The Store API's maximum page size; a larger `limit` fails validation (and a caught error reads as "no items"). */
const PAGE_SIZE = 100;

/** How many items of one kind are read; the rest would be missing from the sitemap. Products get their own ceiling. */
const MAX_ITEMS = 5000;

/**
 * Products read for the sitemap. A sitemap file may hold 50,000 URLs and 50 MB; with the image cap below a product
 * entry is a little over 1 KB, so this many fit, with room for the other kinds. A larger catalog needs its sitemap
 * split into several files; until then its products past this number are reached through links only.
 */
const MAX_PRODUCTS = 25_000;

/** Addresses of one kind a build prerenders. The rest render on their first visit and are cached from then on. */
const MAX_PRERENDERED = 5000;

/** A product's first images are its main ones. Listing every image made a 1,000-product catalogue's sitemap 10 MB. */
export const MAX_IMAGES_PER_PRODUCT = 5;

/** Pages fetched at once after the first: big catalogue bodies can arrive corrupted under heavy parallel load (lib/commerce.ts). */
const CONCURRENCY = 4;

/** Every page of a browse endpoint, up to `maxItems`: the first one gives `meta.count`, the rest follow a few at a time. */
export async function browseAll<T>(
	browse: (page: { limit: number; offset: number }) => Promise<{ data: T[]; meta: { count: number } }>,
	maxItems = MAX_ITEMS,
): Promise<T[]> {
	const first = await browse({ limit: PAGE_SIZE, offset: 0 });
	const pageCount = Math.ceil(Math.min(first.meta.count, maxItems) / PAGE_SIZE);
	const offsets = Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => (i + 1) * PAGE_SIZE);
	const batches = Array.from({ length: Math.ceil(offsets.length / CONCURRENCY) }, (_, i) =>
		offsets.slice(i * CONCURRENCY, (i + 1) * CONCURRENCY),
	);
	const rest = await batches.reduce<Promise<T[][]>>(
		async (done, batch) => [
			...(await done),
			...(await Promise.all(batch.map(async (offset) => (await browse({ limit: PAGE_SIZE, offset })).data))),
		],
		Promise.resolve([]),
	);
	return [first.data, ...rest].flat();
}

const later = (date: string, other: string) => (Date.parse(other) > Date.parse(date) ? other : date);

export async function getAllProducts() {
	"use cache";
	tagKinds("product");
	cacheLife("hours");
	const products = await browseAll((page) => commerce.productBrowse({ active: true, ...page }), MAX_PRODUCTS);
	return products.map((p) => ({
		slug: p.slug,
		updatedAt: p.updatedAt,
		images: p.images.slice(0, MAX_IMAGES_PER_PRODUCT),
		hidden: isHiddenFromSearch(p),
	}));
}

export async function getAllCollections() {
	"use cache";
	tagKinds("collection");
	cacheLife("hours");
	const collections = await browseAll((page) => commerce.collectionBrowse({ active: true, ...page }));
	return collections.map((c) => ({ slug: c.slug, lastModified: c.updatedAt, hidden: isHiddenFromSearch(c) }));
}

export async function getAllCategories() {
	"use cache";
	tagKinds("category");
	cacheLife("hours");
	const categories = await browseAll((page) => commerce.categoriesBrowse({ active: true, ...page }));
	const byId = new Map(categories.map((c) => [c.id, c] as const));
	// Same path as the category canonical: ancestors from the root, at most 3 segments (app/category/[...slugs]).
	const pathOf = (id: string, depth = 0): string[] => {
		const category = byId.get(id);
		if (!category) return [];
		const parents = category.parentId && depth < 2 ? pathOf(category.parentId, depth + 1) : [];
		return [...parents, category.slug];
	};
	return categories.map((c) => ({
		path: pathOf(c.id).join("/"),
		lastModified: c.updatedAt ?? c.createdAt,
		hidden: isHiddenFromSearch(c),
	}));
}

export async function getAllLegalPages() {
	"use cache";
	tagKinds("legal");
	cacheLife("hours");
	const result = await commerce.legalPageBrowse();
	return result.data.map((p) => ({ path: p.href, updatedAt: p.updatedAt }));
}

export async function getAllPosts() {
	"use cache";
	tagKinds("post");
	cacheLife("hours");
	const posts = await browseAll((page) => commerce.postBrowse({ active: true, ...page }));
	// A scheduled post is saved before it goes live, so its last change is the later of the two.
	return posts.map((p) => ({
		slug: p.slug,
		lastModified: later(p.publishedAt ?? p.createdAt, p.updatedAt),
		hidden: isHiddenFromSearch(p),
	}));
}

/**
 * With Cache Components, `generateStaticParams` must return at least one entry. On an empty catalog (or an API
 * error during the build) a route gets this placeholder, which the page answers with `notFound()`.
 */
export const PLACEHOLDER_SLUG = "__placeholder__";

/**
 * Only URL-safe slugs are prerendered: Next writes the page path into a header while prerendering, and a space or a
 * non-ASCII letter there fails the whole build ("Cannot convert argument to a ByteString"). Any other slug still
 * works; it renders on its first visit like a page added after the build.
 */
export const isStaticSlug = (slug: string) => /^[A-Za-z0-9._~-]+$/.test(slug);

/** The catalog values, or the single placeholder when there are none. */
export const withPlaceholder = <V>(values: V[], placeholder: V) =>
	values.length > 0 ? values : [placeholder];

/**
 * Static params for a `[slug]` route: the catalog's URL-safe slugs, or the placeholder when there are none or the
 * read fails. Only the first `MAX_PRERENDERED` are built ahead of time, so a huge catalog is not a huge build.
 */
export async function slugParams<T>(items: Promise<T[]>, slugOf: (item: T) => string) {
	const slugs = (await items.catch(() => [])).map(slugOf).filter(isStaticSlug).slice(0, MAX_PRERENDERED);
	return withPlaceholder(slugs, PLACEHOLDER_SLUG).map((slug) => ({ slug }));
}
