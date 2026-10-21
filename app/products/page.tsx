import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingLayout, ListingSidebar } from "@/components/listing-sidebar";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { sortOptionFor } from "@/lib/sort-options";

const PRODUCTS_PER_PAGE = 12;

type Facets = Awaited<ReturnType<typeof getFilterFacets>>;

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
	const sortOption = sortOptionFor(filters.sort);

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
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className={LISTING_GRID}>
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 2} />
				))}
			</div>

			<ListingPagination
				basePath="/products"
				currentPage={currentPage}
				totalPages={totalPages}
				totalCount={result.meta.count}
				perPage={PRODUCTS_PER_PAGE}
				filters={filters}
			/>
		</>
	);
}

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell stays
// prerenderable; `ProductList` remains cached, keyed on the resolved filters.
async function ProductSection({
	searchParams,
	facets,
	filtersAvailable,
}: {
	searchParams: Promise<ProductFilterParams>;
	facets: Facets;
	filtersAvailable: boolean;
}) {
	const filters = await searchParams;
	return (
		<ListingLayout
			sidebar={
				<ListingSidebar
					basePath="/products"
					params={filters}
					categories={facets.categories}
					filters={filtersAvailable ? <ProductFiltersMobile facets={facets} /> : undefined}
				/>
			}
		>
			<ProductList filters={filters} />
		</ListingLayout>
	);
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
		<>
			<h1 className="sr-only">All Products</h1>
			<Suspense
				fallback={
					<ListingLayout
						sidebar={<ListingSidebar basePath="/products" params={null} categories={facets.categories} />}
					>
						<ProductGridSkeleton count={12} />
					</ListingLayout>
				}
			>
				<ProductSection searchParams={searchParams} facets={facets} filtersAvailable={filtersAvailable} />
			</Suspense>
		</>
	);
}
