import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { sentenceCase } from "@/lib/utils";

export type BrowseProduct = APIProductsBrowseResult["data"][number];

export { sentenceCase } from "@/lib/utils";

export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.name || "Your Next Store";
}

/** Number of active products in a category or collection (0 when the lookup fails). */
async function productCount(filter: { category: string } | { collection: string }) {
	const result = await commerce
		.productBrowse({ active: true, limit: 1, ...filter })
		.catch(() => ({ meta: { count: 0 } }));
	return result.meta.count;
}

/** Categories that hold products, in the merchant's order (the facets also list empty ones). */
export async function getShopCategories() {
	"use cache";
	cacheLife("hours");
	const facets = await getFilterFacets();
	const counted = await Promise.all(
		facets.categories.map(async (category) => ({
			slug: category.slug,
			name: sentenceCase(category.name),
			count: await productCount({ category: category.slug }),
		})),
	);
	return counted.filter((category) => category.count > 0).map(({ slug, name }) => ({ slug, name }));
}

/** Collections that hold products, in the merchant's order. */
export async function getShopCollections() {
	"use cache";
	cacheLife("hours");
	const facets = await getFilterFacets();
	const counted = await Promise.all(
		facets.collections.map(async (collection) => ({
			slug: collection.slug,
			name: collection.name,
			count: await productCount({ collection: collection.slug }),
		})),
	);
	return counted.filter((collection) => collection.count > 0).map(({ slug, name }) => ({ slug, name }));
}

/** The first collection with products, else the first category: the editorial panels' destination. */
export async function getFeaturedGroup() {
	"use cache";
	cacheLife("hours");
	const [collections, categories] = await Promise.all([getShopCollections(), getShopCategories()]);
	const collection = collections[0];
	if (collection) {
		return { href: `/collection/${collection.slug}`, title: collection.name };
	}
	const category = categories[0];
	return category ? { href: `/category/${category.slug}`, title: category.name } : null;
}

const imagesOf = (product: BrowseProduct) => [
	...product.images,
	...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
];

const pictured = (product: BrowseProduct) => imagesOf(product).length > 0;

/** The home page's "A few favourites" row: the first four products with a photo. */
export async function getHomeFavourites() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 12 }).catch(() => ({ data: [] }));
	return data.filter(pictured).slice(0, 4);
}

/** On-sale products first; when nothing is discounted, the newest arrivals take the slot. */
export async function getSaleOrNewest() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce.productBrowse({
		active: true,
		limit: 24,
		orderBy: "createdAt",
		orderDirection: "desc",
	});
	// The edit is two large cards: skip products without a photo, and the favourites row above it.
	const favourites = new Set((await getHomeFavourites()).map((product) => product.id));
	const data = result.data.filter((product) => pictured(product) && !favourites.has(product.id));
	const onSale = data.filter((product) =>
		product.variants.some(
			(variant) => BigInt(variant.originalPrice ?? variant.price) > BigInt(variant.price),
		),
	);
	return onSale.length >= 2
		? { kind: "sale" as const, products: onSale.slice(0, 2) }
		: { kind: "new" as const, products: data.slice(0, 2) };
}

type RichText = { text?: string; content?: RichText[] };

/** Category and collection descriptions arrive as TipTap JSON; listing headers want one plain line. */
export function plainText(value: string | RichText | null | undefined): string | null {
	if (!value) {
		return null;
	}
	if (typeof value === "string") {
		return value.trim() || null;
	}
	const walk = (node: RichText): string =>
		[node.text ?? "", ...(node.content ?? []).map(walk)].join(node.content ? " " : "");
	const text = walk(value).replace(/\s+/g, " ").trim();
	return text || null;
}
