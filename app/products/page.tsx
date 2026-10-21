import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingHeading } from "@/components/listing-heading";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { sortOptions } from "@/lib/sort";
import { SortLinks, SortSelect } from "./products-sort-select";

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
			<div className="flex min-h-[40vh] items-center justify-center text-center">
				<p className="text-2xl font-semibold text-slate-400">No products match these filters</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-12">
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
	);
}

async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

/** Same box as the real toolbar: the sort pills and Filters button read useSearchParams. */
function ToolbarSkeleton() {
	return (
		<div className="flex h-9 items-center justify-between gap-3">
			<div className="h-9 w-24 rounded-lg bg-slate-100" />
			<div className="h-9 w-36 rounded-lg bg-slate-100" />
		</div>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const facets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="min-h-svh px-6">
			<div className="mx-auto mb-32 max-w-7xl">
				<ListingHeading muted="All" strong="Products" />
				<div className="mb-8">
					<Suspense fallback={<ToolbarSkeleton />}>
						<div className="flex h-9 items-center justify-between gap-3">
							{filtersAvailable ? <ProductFiltersMobile facets={facets} /> : <span />}
							<div className="hidden items-center gap-2 lg:flex">
								<SortLinks options={sortOptions} />
							</div>
							<SortSelect options={sortOptions} className="lg:hidden" />
						</div>
					</Suspense>
				</div>
				<Suspense fallback={<ProductGridSkeleton count={12} />}>
					<ProductSection searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	);
}
