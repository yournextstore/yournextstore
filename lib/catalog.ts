import type { APICollectionGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";
import { encodeVts } from "@/lib/vts";

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Only a `manual` collection keeps its members in the join table that `collectionGet` returns —
// the smart filters are evaluated against the whole catalog when the storefront asks for them.
// Re-expressing each one as the equivalent product browse is what keeps those collections from
// rendering as an empty grid. Cached like the collection itself, which also pins the
// `Date.now()` below to the cache entry.
export async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const { filter } = collection;

	if (filter.type === "manual") {
		const ids = collection.productCollections.map((pc) => pc.product.id);
		// The SDK throws on a 404: one product deleted since it joined must not fail the page.
		return (
			await Promise.all(ids.map((id) => commerce.productGet({ idOrSlug: id }).catch(() => null)))
		).filter((product) => product !== null);
	}

	if (filter.type === "variantValues") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			vts: encodeVts(filter.values),
		});
		return data;
	}

	if (filter.type === "dynamicPrice") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			priceMin: filter.min ?? undefined,
			priceMax: filter.max ?? undefined,
		});
		return data;
	}

	const { data } = await commerce.productBrowse({
		active: true,
		limit: SMART_COLLECTION_LIMIT,
		orderBy: "createdAt",
		orderDirection: "desc",
	});

	// A rolling "new arrivals" window has no browse equivalent, so the age bound is applied here.
	if (typeof filter.days !== "number") {
		return data;
	}
	const cutoff = Date.now() - filter.days * MS_PER_DAY;
	return data.filter((product) => new Date(product.createdAt).getTime() >= cutoff);
}

export type CatalogProduct = Awaited<ReturnType<typeof getCollectionProducts>>[number];

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

/** A product's first still, falling back to its variants' photographs. */
const productStill = (product: CatalogProduct) =>
	firstStill(product.images) ?? firstStill(product.variants.flatMap((variant) => variant.images ?? []));

/**
 * A browsed collection that can show products: hand-picked members or metafield rules. Empty
 * manual collections stay out of menus and tabs, so no link leads to an empty page.
 */
export const collectionHasProducts = (collection: {
	active: boolean;
	productCollections: readonly unknown[];
	metafieldRules?: readonly unknown[] | null;
}) =>
	collection.active &&
	(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0);

/**
 * The home page's product rail: the first collection that has products (the original's
 * "Our Blends"), or the newest products when the store has no collections yet.
 */
export async function getFeaturedRail(): Promise<{
	title: string;
	href: string;
	products: CatalogProduct[];
}> {
	"use cache";
	cacheLife("minutes");
	const collections = await commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] }));
	for (const summary of collections.data) {
		const collection = await commerce.collectionGet({ idOrSlug: summary.slug }).catch(() => null);
		if (!collection) continue;
		const products = await getCollectionProducts(collection);
		if (products.length >= 3) {
			return {
				title: collection.name,
				href: `/collection/${collection.slug}`,
				products: products.slice(0, 10),
			};
		}
	}
	const { data } = await commerce
		.productBrowse({ active: true, limit: 10, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] }));
	return { title: "Our Products", href: "/products", products: data };
}

/** Product photographs for the editorial sections, standing in for the original's packshots. */
export async function getStoryImages(count: number): Promise<{ src: string; alt: string; slug: string }[]> {
	"use cache";
	cacheLife("minutes");
	const { products } = await getFeaturedRail();
	return products
		.flatMap((product) => {
			const src = productStill(product);
			return src ? [{ src, alt: product.name, slug: product.slug }] : [];
		})
		.slice(0, count);
}

/** Flattens a TipTap document (or a plain string) into its visible text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value;
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

/** Collections as listing tabs, cached with the rest of the catalog reads. */
export async function getCollectionTabs() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] }));
	return data
		.filter(collectionHasProducts)
		.slice(0, 8)
		.map((collection) => ({ slug: collection.slug, name: collection.name }));
}

/** Top-level categories as listing tabs. */
export async function getCategoryTabs() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] }));
	return data
		.filter((category) => !category.parentId)
		.map((category) => ({ slug: category.slug, name: category.name }));
}
