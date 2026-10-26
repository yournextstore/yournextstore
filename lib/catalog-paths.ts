import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";

// Every catalog address, for app/sitemap.ts and for `generateStaticParams`: known pages prerender completely
// (no loading states), and an address added later renders on its first visit and is cached from then on.

/** The Store API's maximum page size; a larger `limit` fails validation (and a caught error reads as "no items"). */
const PAGE_SIZE = 100;
const MAX_ITEMS = 5000;

/** Pages fetched at once after the first: big catalogue bodies can arrive corrupted under heavy parallel load (lib/commerce.ts). */
const CONCURRENCY = 4;

/** Every page of a browse endpoint: the first one gives `meta.count`, the rest follow a few at a time. */
async function browseAll<T>(
	browse: (page: { limit: number; offset: number }) => Promise<{ data: T[]; meta: { count: number } }>,
): Promise<T[]> {
	const first = await browse({ limit: PAGE_SIZE, offset: 0 });
	const pageCount = Math.ceil(Math.min(first.meta.count, MAX_ITEMS) / PAGE_SIZE);
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

export async function getAllProducts() {
	"use cache";
	cacheLife("hours");
	const products = await browseAll((page) => commerce.productBrowse({ active: true, ...page }));
	return products.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt, images: p.images }));
}

export async function getAllCollections() {
	"use cache";
	cacheLife("hours");
	const collections = await browseAll((page) => commerce.collectionBrowse({ active: true, ...page }));
	return collections.map((c) => ({ slug: c.slug, lastModified: c.createdAt }));
}

export async function getAllCategories() {
	"use cache";
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
	return categories.map((c) => ({ path: pathOf(c.id).join("/"), lastModified: c.updatedAt ?? c.createdAt }));
}

export async function getAllLegalPages() {
	"use cache";
	cacheLife("hours");
	const result = await commerce.legalPageBrowse();
	return result.data.map((p) => ({ path: p.href, updatedAt: p.updatedAt }));
}

export async function getAllPosts() {
	"use cache";
	cacheLife("hours");
	const posts = await browseAll((page) => commerce.postBrowse({ active: true, ...page }));
	return posts.map((p) => ({ slug: p.slug, lastModified: p.publishedAt ?? p.createdAt }));
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

/** Static params for a `[slug]` route: the catalog's URL-safe slugs, or the placeholder when there are none or the read fails. */
export async function slugParams<T>(items: Promise<T[]>, slugOf: (item: T) => string) {
	const slugs = (await items.catch(() => [])).map(slugOf).filter(isStaticSlug);
	return withPlaceholder(slugs, PLACEHOLDER_SLUG).map((slug) => ({ slug }));
}
