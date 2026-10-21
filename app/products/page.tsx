import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingBand } from "@/components/listing-band";
import { ListingEmpty, ListingGrid, ListingGridSkeleton } from "@/components/listing-grid";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { SortLinks, SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

type ProductFilterParams = {
	page?: string;
	sort?: string;
	category?: string;
	collection?: string;
	brand?: string;
	priceMin?: string;
	priceMax?: string;
	vts?: string;
};

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
	const { page } = await searchParams;
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

async function ProductList({ filters, withFilters }: { filters: ProductFilterParams; withFilters: boolean }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];

	const result = await commerce.productBrowse({
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
		category: filters.category,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return <ListingEmpty />;
	}

	return (
		<>
			<ListingGrid products={result.data} withFilters={withFilters} />

			<ListingPagination
				basePath="/products"
				currentPage={currentPage}
				totalPages={totalPages}
				filters={filters}
			/>
		</>
	);
}

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; `ProductList` remains cached, keyed on the resolved filters.
async function ProductSection({
	searchParams,
	withFilters,
}: {
	searchParams: Promise<ProductFilterParams>;
	withFilters: boolean;
}) {
	const filters = await searchParams;
	return <ProductList filters={filters} withFilters={withFilters} />;
}

// Same frame as the streamed content (sidebar, toolbar row, grid), so nothing moves when it lands.
function ListingFallback({ withFilters }: { withFilters: boolean }) {
	return (
		<div className={withFilters ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
			{withFilters && <div className="hidden lg:block" />}
			<div>
				<div className="mb-10 h-[46px]" />
				<ListingGridSkeleton withFilters={withFilters} />
			</div>
		</div>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// `facets` is cached and independent of `searchParams`, so it can drive the layout
	// shell without making the route blocking. Runtime `searchParams` is read inside the
	// Suspense boundary below (see `ProductSection`).
	const facets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<>
			<ListingBand
				title="Shop"
				crumbs={[{ href: "/", label: "Home" }, { label: "Shop" }]}
				description="Every piece in the store, in one place. Sort it, filter it, find your next favourite."
			/>
			<div className="sp-container py-[60px] md:py-[100px]">
				{/* The filter and sort controls read useSearchParams(), so they stream in behind one
				    boundary with the grid while the chrome and the band above prerender. */}
				<Suspense fallback={<ListingFallback withFilters={filtersAvailable} />}>
					<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
						{filtersAvailable && <ProductFilters facets={facets} />}

						<div>
							<div className="mb-10 flex min-h-[46px] flex-wrap items-center justify-between gap-4">
								{filtersAvailable ? <ProductFiltersMobile facets={facets} /> : <span />}
								<div className="flex items-center gap-4 lg:hidden">
									<SortSelect options={sortOptions} />
								</div>
								<div className="hidden flex-wrap items-center gap-x-6 gap-y-2 lg:flex">
									<span className="text-sm font-semibold uppercase">Sort by</span>
									<SortLinks options={sortOptions} />
								</div>
							</div>

							<ProductSection searchParams={searchParams} withFilters={filtersAvailable} />
						</div>
					</div>
				</Suspense>
			</div>
		</>
	);
}
