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
		return await commerce.productFilters();
	} catch {
		return EMPTY_FACETS;
	}
}

/** Whether a listing has anything to filter by; a category page hides the category facet itself. */
export const hasFacets = (
	facets: Awaited<ReturnType<typeof getFilterFacets>>,
	{ categories = true }: { categories?: boolean } = {},
) =>
	(categories && facets.categories.length > 0) ||
	facets.collections.length > 0 ||
	facets.brands.length > 0 ||
	facets.variantTypes.length > 0 ||
	facets.priceBounds.max > 0;
