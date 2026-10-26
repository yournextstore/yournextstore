import { ProductsView, productsMetadata } from "@/app/products/products-view";
import { activeParams, PRODUCT_LISTING_PARAMS } from "@/lib/listing-routes";

// `/products?…` with a filter, sort or page is rewritten here (lib/listing-routes.ts). The query is only known per
// request, so the page renders in full then: a navigation keeps the current view until it is ready, with no skeleton.
export const instant = false;

export async function generateMetadata(props: PageProps<"/products-filtered">) {
	const { page } = await props.searchParams;
	return productsMetadata(typeof page === "string" ? page : undefined);
}

export default async function ProductsFilteredPage(props: PageProps<"/products-filtered">) {
	return <ProductsView filters={activeParams(PRODUCT_LISTING_PARAMS, await props.searchParams)} />;
}
