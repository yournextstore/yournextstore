import { cacheLife } from "next/cache";
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
		const [facets, collections] = await Promise.all([
			commerce.productFilters(),
			commerce.collectionBrowse({ limit: 50 }).catch(() => null),
		]);
		if (!collections) return facets;
		// A manual collection without members opens an empty page, so it never shows up as a link.
		const filled = new Set(
			collections.data
				.filter((c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0)
				.map((c) => c.slug),
		);
		return { ...facets, collections: facets.collections.filter((c) => filled.has(c.slug)) };
	} catch {
		return EMPTY_FACETS;
	}
}

export type FilterFacets = Awaited<ReturnType<typeof getFilterFacets>>;
