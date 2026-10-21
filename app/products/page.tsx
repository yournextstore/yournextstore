import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { photographedFirst } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { sortOptions } from "@/lib/sort";
import { SortRadios, SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 12;

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

async function getProductPage(filters: ProductFilterParams) {
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
	return { result, currentPage };
}

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	const { result, currentPage } = await getProductPage(filters);
	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className={PRODUCT_GRID}>
				{(filters.sort ? result.data : photographedFirst(result.data)).map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 2} />
				))}
			</div>

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
// stays prerenderable; the browse itself stays cached, keyed on the resolved filters.
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

async function ProductCount({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	const { result } = await getProductPage(filters);
	return <>{result.meta.count}</>;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// `facets` is cached and independent of `searchParams`, so it can drive the layout
	// shell without making the route blocking.
	const facets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="layout min-h-svh pt-8 pb-24 lg:grid lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[14rem_minmax(0,1fr)]">
			{/* The sidebar reads useSearchParams(); it sits in its own grid column, so streaming it
			    in shifts nothing. */}
			<Suspense fallback={<div className="hidden lg:block" />}>
				<ProductFilters facets={facets} sortSlot={<SortRadios options={sortOptions} />} />
			</Suspense>

			<div className="flex min-w-0 flex-col">
				<div className="mb-5 flex flex-wrap items-center justify-between gap-3 lg:mb-3">
					<h1 className="text-xl font-semibold">
						Products (
						<Suspense
							fallback={
								<span className="inline-block h-5 w-5 animate-pulse rounded bg-secondary align-middle" />
							}
						>
							<ProductCount searchParams={searchParams} />
						</Suspense>
						)
					</h1>
					<div className="flex items-center gap-2 lg:hidden">
						<Suspense
							fallback={
								<>
									{filtersAvailable && <div className="h-9 w-24 rounded-full border border-border" />}
									<div className="h-8 w-36 rounded-md border border-input" />
								</>
							}
						>
							{filtersAvailable && <ProductFiltersMobile facets={facets} />}
							<SortSelect options={sortOptions} />
						</Suspense>
					</div>
				</div>

				<Suspense fallback={<ProductGridSkeleton count={12} />}>
					<ProductSection searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	);
}
