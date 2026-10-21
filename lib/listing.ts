import { cacheLife } from "next/cache";
import { shortName } from "@/lib/display";
import { getFilterFacets } from "@/lib/facets";
import type { FacetControl } from "@/lib/sort";

/** Category, collection and brand selects for the listing row; empty facets drop out. */
export async function getFacetControls(): Promise<FacetControl[]> {
	"use cache";
	cacheLife("minutes");
	const facets = await getFilterFacets();
	const controls: FacetControl[] = [
		{
			param: "category",
			placeholder: "All categories",
			options: facets.categories.map((c) => ({ value: c.slug, label: shortName(c.name) })),
		},
		{
			param: "collection",
			placeholder: "All collections",
			options: facets.collections.map((c) => ({ value: c.slug, label: c.name })),
		},
		{
			param: "brand",
			placeholder: "All brands",
			options: facets.brands.map((b) => ({ value: b.slug, label: b.name })),
		},
	];
	return controls.filter((control) => control.options.length > 0);
}
