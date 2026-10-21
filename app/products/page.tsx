import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { CollectionsCarousel } from "@/components/sections/collections-carousel";
import { ProductFilterBar, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", label: "Latest arrivals", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Lowest price", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Highest price", orderBy: "price", orderDirection: "desc" },
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
		return <p className="py-16 md:text-title-md">No products match these filters.</p>;
	}

	return (
		<>
			<div className="grid grid-cols-12 gap-x-4 gap-y-10 md:gap-x-12 md:gap-y-16">
				{result.data.map((product) => (
					<div key={product.id} className="col-span-6 md:col-span-4">
						<ProductCard product={product} />
					</div>
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
		<div className="pt-8 pb-26 md:pt-26 md:pb-36">
			{/* Cached, and deliberately outside any boundary: it lands in the prerendered shell
			    instead of streaming in later and pushing the grid down. */}
			<CollectionsCarousel size="sm" className="mb-26 md:mb-36" />
			<div className="layout">
				<div className="col-span-full">
					<h1 id="products" className="mb-6 text-title-md md:mb-7 md:text-title-2xl">
						Shop
					</h1>
					{/* The filter and sort controls read useSearchParams(), so they stream in behind one
					    boundary with the grid while the chrome and the heading above prerender. */}
					<Suspense
						fallback={
							<>
								<div className="mb-6 h-8 md:mb-8 md:h-10" />
								<ProductGridSkeleton />
							</>
						}
					>
						<div className="mb-6 flex justify-between gap-10 md:mb-8">
							{filtersAvailable ? (
								<>
									<ProductFiltersMobile facets={facets} />
									<ProductFilterBar facets={facets} />
								</>
							) : (
								<span />
							)}
							<SortSelect options={sortOptions} />
						</div>
						<ProductSection searchParams={searchParams} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
