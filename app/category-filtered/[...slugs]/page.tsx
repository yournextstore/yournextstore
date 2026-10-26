import { CategoryView, categoryMetadata } from "@/app/category/[...slugs]/category-view";
import { activeParams, CATEGORY_LISTING_PARAMS } from "@/lib/listing-routes";

// `/category/…?…` with a filter or page number is rewritten here (lib/listing-routes.ts). The query is only known per
// request, so the page renders in full then: a navigation keeps the current view until it is ready, with no skeleton.
export const instant = false;

export async function generateMetadata(props: PageProps<"/category-filtered/[...slugs]">) {
	const { slugs } = await props.params;
	return categoryMetadata(slugs);
}

export default async function CategoryFilteredPage(props: PageProps<"/category-filtered/[...slugs]">) {
	const [{ slugs }, query] = await Promise.all([props.params, props.searchParams]);
	return <CategoryView slugs={slugs} filters={activeParams(CATEGORY_LISTING_PARAMS, query)} />;
}
