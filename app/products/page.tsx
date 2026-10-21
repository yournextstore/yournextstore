import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { SortLinks, SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Lowest", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Highest", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "A–Z", orderBy: "name", orderDirection: "asc" },
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

async function ProductList({ filters }: { filters: ProductFilterParams }) {
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

	return (
		<>
			<ListingToolbar count={result.meta.count} />
			{result.data.length === 0 ? (
				<div className="py-24 text-center">
					<p className="text-lg text-muted-foreground">No products match these filters.</p>
				</div>
			) : (
				<>
					<h2 className="sr-only">Products</h2>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
						{result.data.map((product, index) => (
							<ProductCard key={product.id} product={product} priority={index === 0} />
						))}
					</div>
					<ListingPagination
						basePath="/products"
						currentPage={currentPage}
						totalPages={totalPages}
						filters={filters}
					/>
				</>
			)}
		</>
	);
}

function ListingToolbar({ count }: { count: number }) {
	return (
		<div className="mb-5 flex min-h-8 items-center justify-between gap-4">
			<p className="text-sm text-muted-foreground">
				{count} {count === 1 ? "product" : "products"}
			</p>
			<div className="hidden items-center gap-4 sm:flex">
				<span className="text-sm text-muted-foreground">Sort:</span>
				<SortLinks options={sortOptions} />
			</div>
			<SortSelect options={sortOptions} className="sm:hidden" />
		</div>
	);
}

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; `ProductList` remains cached, keyed on the resolved filters.
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
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
		<div className="wrapper min-h-svh py-10">
			<h1 className="mb-8 font-display text-3xl font-bold text-foreground lg:text-4xl">All Products</h1>

			{/* The filter and sort controls read useSearchParams(), so they stream in behind one
			    boundary with the grid while the chrome and the heading above prerender. */}
			<Suspense fallback={<ListingSkeleton filters={filtersAvailable} />}>
				<div className={filtersAvailable ? "lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12" : ""}>
					{filtersAvailable && <ProductFilters facets={facets} />}

					<div>
						{filtersAvailable && (
							<div className="mb-4 lg:hidden">
								<ProductFiltersMobile facets={facets} />
							</div>
						)}
						<ProductSection searchParams={searchParams} />
					</div>
				</div>
			</Suspense>
		</div>
	);
}

function ListingSkeleton({ filters }: { filters: boolean }) {
	return (
		<div className={filters ? "lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12" : ""}>
			{filters && <div className="hidden h-96 lg:block" />}
			<div>
				{filters && <div className="mb-4 h-8 w-24 rounded-md border border-border lg:hidden" />}
				<div className="mb-5 flex min-h-8 items-center">
					<div className="h-4 w-24 animate-pulse rounded bg-secondary" />
				</div>
				<ProductGridSkeleton />
			</div>
		</div>
	);
}
