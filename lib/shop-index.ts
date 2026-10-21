import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";

type Entry = { slug: string; name: string };

/**
 * Collections and categories that actually hold products, for the comma-separated indexes and
 * the header nav: an empty manual collection or category would lead to a "nothing here" page.
 */
export async function getShopIndex(): Promise<{ collections: Entry[]; categories: Entry[] }> {
	"use cache";
	cacheLife("minutes");
	const [collections, facets] = await Promise.all([
		commerce.collectionBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getFilterFacets(),
	]);
	const filledCategories = await Promise.all(
		facets.categories.map(async (category) => {
			const result = await commerce
				.productBrowse({ active: true, limit: 1, category: category.slug })
				.catch(() => null);
			return result && result.data.length > 0 ? { slug: category.slug, name: category.name } : null;
		}),
	);
	return {
		collections: collections.data
			.filter((c) => c.productCollections.length > 0 || (c.metafieldRules?.length ?? 0) > 0)
			.map((c) => ({ slug: c.slug, name: c.name })),
		categories: filledCategories.filter((c) => c !== null),
	};
}
