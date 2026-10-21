import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { SortLinks, SortLinksFallback } from "./products-sort-select";

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

	if (result.data.length === 0) {
		return <p className="py-24 text-center">No products match these filters.</p>;
	}

	return (
		<>
			<ul className={PRODUCT_GRID}>
				{result.data.map((product, index) => (
					<li key={product.id}>
						<ProductCard product={product} priority={index === 0} sizes="(width >= 64rem) 25vw, 50vw" />
					</li>
				))}
			</ul>

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

	const toolbar = (sort: React.ReactNode, filters: React.ReactNode) => (
		<div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 lg:grid-site">
			<div className="lg:col-span-3">{filters}</div>
			<div className="lg:col-span-9 lg:col-start-4">{sort}</div>
		</div>
	);

	return (
		<div data-flush>
			<h1 className="px-3 pt-16 text-heading lg:pt-20">Shop, Index</h1>

			<section className="card mx-1 mt-3 bg-paper" aria-label="Products">
				{/* The filter and sort controls read useSearchParams(), so they stream in behind one
				    boundary with the grid; the fallback sets the same toolbar text, so nothing shifts. */}
				<Suspense
					fallback={
						<>
							{toolbar(
								<SortLinksFallback options={sortOptions} />,
								filtersAvailable ? <span className="tap lg:hidden">Filters</span> : null,
							)}
							<div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-3 lg:mt-16">
								<ProductGridSkeleton className="lg:col-span-9 lg:col-start-4" />
							</div>
						</>
					}
				>
					{toolbar(
						<SortLinks options={sortOptions} />,
						filtersAvailable ? <ProductFiltersMobile facets={facets} /> : null,
					)}
					<div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-3">
						{filtersAvailable && <ProductFilters facets={facets} className="lg:col-span-3 lg:pr-6" />}
						<div className="lg:col-span-9 lg:col-start-4">
							<ProductSection searchParams={searchParams} />
						</div>
					</div>
				</Suspense>
			</section>
		</div>
	);
}
