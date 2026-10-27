import { cacheLife } from "next/cache";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import type { ProductListingParams } from "@/lib/listing-routes";

const PRODUCTS_PER_PAGE = 12;

type ListingQuery = {
	filters: ProductListingParams;
	/** Fixed category of a category page; on `/products` it comes from the filters. */
	category?: string;
	order?: { orderBy: "createdAt" | "price" | "name" | "featured"; orderDirection: "asc" | "desc" };
};

/** One page of a listing. Cached, so a view can start it alongside its facets and the grid reads the same entry. */
export async function getListingPage({ filters, category, order }: ListingQuery) {
	"use cache";
	cacheLife("minutes");
	const currentPage = Math.max(1, Number(filters.page) || 1);
	const result = await commerce.productBrowse({
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
		...order,
		category: category ?? filters.category,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});
	return { currentPage, result, totalPages: Math.ceil(result.meta.count / PRODUCTS_PER_PAGE) };
}

/** Product grid and pagination shared by `/products` and category pages. */
export async function ListingProducts({ basePath, ...query }: ListingQuery & { basePath: string }) {
	const { currentPage, result, totalPages } = await getListingPage(query);

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
			<ListingPagination
				basePath={basePath}
				currentPage={currentPage}
				totalPages={totalPages}
				filters={query.filters}
			/>
		</>
	);
}
