import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce } from "@/lib/commerce";
import { DEMO_PRODUCTS, isPreview } from "@/lib/demo-products";
import { ProductsPagination } from "./products-pagination";
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
	preview?: string;
};

async function getFilterFacets() {
	"use cache";
	cacheLife("minutes");
	return commerce.productFilters();
}

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<ProductFilterParams>;
}): Promise<Metadata> {
	const params = await searchParams;
	const preview = await isPreview(params);
	const base: Metadata = {
		title: "All Products — Your Next Store",
		description: "Browse our complete collection of slow-made home essentials.",
	};
	if (preview) base.robots = { index: false, follow: false };
	return base;
}

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];
	const preview = await isPreview(filters);

	if (preview) {
		const data = DEMO_PRODUCTS;
		return (
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
				{data.map((product) => (
					<ProductCard key={product.id} product={product} isPreview={true} />
				))}
			</div>
		);
	}

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
				<p className="font-serif text-lg text-espresso/70">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			<ProductsPagination currentPage={currentPage} totalPages={totalPages} filters={filters} />
		</>
	);
}

function ProductGridSkeleton() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={`skeleton-${i}`}>
					<div className="aspect-[4/5] bg-sand rounded-md mb-4 animate-pulse" />
					<div className="space-y-2">
						<div className="h-5 w-3/4 bg-sand rounded animate-pulse" />
						<div className="h-3 w-1/3 bg-sand rounded animate-pulse" />
					</div>
				</div>
			))}
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
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
			<div className="mb-10">
				<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80 mb-3">The shop</p>
				<h1 className="font-serif text-4xl sm:text-6xl tracking-tight text-walnut">All products</h1>
				<p className="mt-3 text-base text-espresso/65 max-w-md">
					Browse the full collection — one season at a time, made by hand.
				</p>
			</div>

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} />}

				<div>
					{/* Mobile/tablet toolbar: Filters button + compact Sort dropdown (sidebar is hidden below lg). */}
					<div className="mb-8 flex items-center justify-between gap-3 lg:hidden">
						{filtersAvailable ? <ProductFiltersMobile facets={facets} /> : <span />}
						<SortSelect options={sortOptions} />
					</div>

					{/* Desktop toolbar: inline sort links (filters live in the sidebar). */}
					<div className="mb-8 hidden flex-wrap items-center gap-3 lg:flex">
						<span className="text-sm text-muted-foreground">Sort by:</span>
						<SortLinks options={sortOptions} />
					</div>

					<Suspense fallback={<ProductGridSkeleton />}>
						<ProductSection searchParams={searchParams} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
