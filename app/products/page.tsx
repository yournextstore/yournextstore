import { ProductsView, productsMetadata } from "@/app/products/products-view";
import { SearchParamsProbe } from "@/components/search-params-probe";

// The default view never reads the query, so it prerenders in full; filters, sort and pages go through
// `/products-filtered` (lib/listing-routes.ts). The probe makes the client router ask the server for those.
export const generateMetadata = () => productsMetadata(undefined);

export default function ProductsPage(props: PageProps<"/products">) {
	return (
		<>
			<SearchParamsProbe searchParams={props.searchParams} />
			<ProductsView filters={{}} />
		</>
	);
}
