import { cacheLife } from "next/cache";
import { getCatalogProducts } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

const EMPTY_FACETS = {
	priceBounds: { min: 0, max: 0 },
	variantTypes: [],
	categories: [],
	collections: [],
	brands: [],
} satisfies Awaited<ReturnType<typeof commerce.productFilters>>;

export async function getFilterFacets() {
	"use cache";
	cacheLife("minutes");
	// Filters are an enhancement — never let a facets failure take down the product list.
	try {
		const [facets, products, collections] = await Promise.all([
			commerce.productFilters(),
			getCatalogProducts(),
			commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		]);
		// Drop categories and manual collections that hold nothing: each would be a filter that
		// leads to an empty grid.
		const filledCollections = new Set(
			collections.data
				.filter((c) => c.productCollections.length > 0 || (c.metafieldRules?.length ?? 0) > 0)
				.map((c) => c.slug),
		);
		return {
			...facets,
			categories: facets.categories.filter((c) => products.some((p) => p.category?.slug === c.slug)),
			collections: facets.collections.filter((c) => filledCollections.has(c.slug)),
		};
	} catch {
		return EMPTY_FACETS;
	}
}
