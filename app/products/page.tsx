import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { CatalogNav } from "@/components/catalog-nav";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ExploreBanner } from "@/components/sections/explore-banner";
import { Gallery } from "@/components/sections/gallery";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { picturedFirst } from "@/lib/pictured";
import { SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 24;

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
		return (
			<div className="py-24 text-center">
				<p className="text-subheader text-ink-soft">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 md:grid-cols-4">
				{(sortOption.value === "newest" ? picturedFirst(result.data) : result.data).map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} headingLevel="h2" />
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
	// Suspense boundary below (see `ProductSection`). Categories and collections live in the
	// sidebar list; the sheet only opens for the finer facets.
	const facets = await getFilterFacets();
	const refinable = facets.brands.length > 0 || facets.variantTypes.length > 0 || facets.priceBounds.max > 0;

	return (
		<>
			<div className="container-wide pt-6 pb-12 sm:pt-12">
				<div className="lg:grid lg:grid-cols-12 lg:gap-x-4">
					<aside className="hidden lg:col-span-2 lg:block">
						<CatalogNav current="all" className="below-header sticky" />
					</aside>
					<div className="lg:col-span-10">
						<h1 className="mb-6 text-title font-medium">All products</h1>
						{/* The filter and sort controls read useSearchParams(), so they stream in behind one
						    boundary with the grid while the chrome and the heading above prerender. */}
						<Suspense
							fallback={
								<>
									<div className="mb-8 h-8" />
									<ProductGridSkeleton />
								</>
							}
						>
							<div className="mb-8 flex h-8 items-center justify-between gap-3">
								{refinable ? <ProductFiltersMobile facets={facets} triggerClassName="h-8" /> : <span />}
								<SortSelect options={sortOptions} />
							</div>
							<ProductSection searchParams={searchParams} />
						</Suspense>
					</div>
				</div>
			</div>
			<ExploreBanner />
			<Gallery />
		</>
	);
}
