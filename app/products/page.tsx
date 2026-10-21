import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { CategoryStrip, ListingToolbar, ListingToolbarSkeleton } from "@/components/gf/listing";
import { PageBar } from "@/components/gf/page-bar";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { photographedFirst } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { sortOptions } from "@/lib/sort";
import { SortSelect } from "./products-sort-select";

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

type Facets = Awaited<ReturnType<typeof getFilterFacets>>;

async function ProductList({ filters, facets }: { filters: ProductFilterParams; facets: Facets }) {
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
	const filtersAvailable = hasFacets(facets);

	return (
		<>
			<ListingToolbar count={`${result.meta.count} ${result.meta.count === 1 ? "product" : "products"}`}>
				{filtersAvailable && <ProductFiltersMobile facets={facets} />}
				<SortSelect options={sortOptions} />
			</ListingToolbar>
			<h2 className="sr-only">Products</h2>
			{result.data.length === 0 ? (
				<div className="py-16 text-center">
					<p className="text-gf-h5 text-muted-foreground">No products match these filters.</p>
				</div>
			) : (
				<div className={PRODUCT_GRID}>
					{(filters.sort ? result.data : photographedFirst(result.data)).map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index < 2} />
					))}
				</div>
			)}

			<ListingPagination
				basePath="/products"
				currentPage={currentPage}
				totalPages={totalPages}
				filters={filters}
			/>
		</>
	);
}

function hasFacets(facets: Facets) {
	return (
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0
	);
}

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; `ProductList` remains cached, keyed on the resolved filters.
async function ProductSection({
	searchParams,
	facets,
}: {
	searchParams: Promise<ProductFilterParams>;
	facets: Facets;
}) {
	const filters = await searchParams;
	return <ProductList filters={filters} facets={facets} />;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const facets = await getFilterFacets();

	return (
		<div className="min-h-[calc(100svh+160px)]">
			<PageBar title="All products" />
			<CategoryStrip />
			{/* The toolbar reads useSearchParams(), so it streams in with the grid behind one
			    boundary whose fallback has the same rows. */}
			<Suspense
				fallback={
					<>
						<ListingToolbarSkeleton controls={hasFacets(facets) ? 2 : 1} />
						<ProductGridSkeleton count={6} />
					</>
				}
			>
				<ProductSection searchParams={searchParams} facets={facets} />
			</Suspense>
		</div>
	);
}
