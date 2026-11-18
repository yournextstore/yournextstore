import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { tagKinds } from "@/lib/cache-tags";
import { commerce } from "@/lib/commerce";
import { FILTER_KEYS, type ProductListingParams } from "@/lib/listing-routes";

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
	tagKinds("product");
	cacheLife("hours");
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

/**
 * Product grid and pagination shared by `/products` and category pages. A category page passes its id as
 * `trackedCategoryId`, which marks the grid for the platform kit's listing analytics (`data-yns-list`).
 */
export async function ListingProducts({
	basePath,
	trackedCategoryId,
	...query
}: ListingQuery & { basePath: string; trackedCategoryId?: string }) {
	const { currentPage, result, totalPages } = await getListingPage(query);
	const activeFilters = Object.fromEntries(
		FILTER_KEYS.flatMap((key) => (query.filters[key] ? [[key, query.filters[key].split(",")]] : [])),
	);
	const listMarks = trackedCategoryId
		? {
				"data-yns-list": "category",
				"data-yns-list-key": trackedCategoryId,
				"data-yns-results": result.meta.count,
				"data-yns-page": currentPage,
				...(query.filters.sort ? { "data-yns-sort": query.filters.sort } : {}),
				...(Object.keys(activeFilters).length ? { "data-yns-filters": JSON.stringify(activeFilters) } : {}),
			}
		: {};

	// A page number past the last page is not a page: answer 404 instead of an empty listing a crawler can index.
	if (currentPage > 1 && currentPage > totalPages) {
		notFound();
	}

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center" {...listMarks}>
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<div {...listMarks}>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
				{result.data.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						priority={index === 0}
						{...(trackedCategoryId
							? { listPosition: (currentPage - 1) * PRODUCTS_PER_PAGE + index + 1 }
							: {})}
					/>
				))}
			</div>
			<ListingPagination
				basePath={basePath}
				currentPage={currentPage}
				totalPages={totalPages}
				filters={query.filters}
			/>
		</div>
	);
}
