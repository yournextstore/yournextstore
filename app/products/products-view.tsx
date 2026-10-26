import type { Metadata } from "next";
import { SortLinks, SortSelect } from "@/app/products/products-sort-select";
import { getListingPage, ListingProducts } from "@/components/listing-products";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { getStoreSeo } from "@/lib/commerce";
import { getFilterFacets, hasFacets } from "@/lib/facets";
import type { ProductListingParams } from "@/lib/listing-routes";

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

export async function productsMetadata(page: string | undefined): Promise<Metadata> {
	const pageNum = Math.max(1, Number(page) || 1);
	const canonical = pageNum > 1 ? `/products?page=${pageNum}` : "/products";
	const title = pageNum > 1 ? `All Products — Page ${pageNum}` : "All Products";
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Browse the complete ${storeName} collection. ${storeDescription}`
		: `Browse the complete ${storeName} product collection.`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title,
			description,
			url: canonical,
		},
	};
}

/**
 * Every product. The default view (`/products` without a query) prerenders in full; a filter, sort or page number is
 * rewritten to `/products-filtered`, which renders per request (lib/listing-routes.ts).
 */
export async function ProductsView({ filters }: { filters: ProductListingParams }) {
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];
	const order = { orderBy: sortOption.orderBy, orderDirection: sortOption.orderDirection };
	// The listing page starts with the facets instead of after them; the grid below reads the same cache entry.
	const [facets] = await Promise.all([getFilterFacets(), getListingPage({ filters, order })]);
	const filtersAvailable = hasFacets(facets);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-10">
				<h1 className="text-3xl sm:text-4xl font-medium tracking-tight">All Products</h1>
				<p className="mt-2 text-muted-foreground">Browse our complete collection</p>
			</div>

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} active={filters} />}

				<div>
					{/* Mobile/tablet toolbar: Filters button + compact Sort dropdown (sidebar is hidden below lg). */}
					<div className="mb-8 flex items-center justify-between gap-3 lg:hidden">
						{filtersAvailable ? <ProductFiltersMobile facets={facets} active={filters} /> : <span />}
						<SortSelect options={sortOptions} active={filters} />
					</div>

					{/* Desktop toolbar: inline sort links (filters live in the sidebar). */}
					<div className="mb-8 hidden flex-wrap items-center gap-3 lg:flex">
						<span className="text-sm text-muted-foreground">Sort by:</span>
						<SortLinks options={sortOptions} active={filters} />
					</div>

					<ListingProducts basePath="/products" filters={filters} order={order} />
				</div>
			</div>
		</div>
	);
}
