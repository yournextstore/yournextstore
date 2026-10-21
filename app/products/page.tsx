import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { DensitySwitch } from "@/components/density-switch";
import { ListingGridSkeleton, ListingHeading, SectionPills, ToolbarFallback } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { getCatalogCount, getShopSections } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { LISTING_GRID, PRODUCTS_PER_PAGE, SORT_OPTIONS } from "@/lib/listing";
import { SortSelect } from "./products-sort-select";

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
	const title = pageNum > 1 ? `New arrivals — Page ${pageNum}` : "New arrivals";
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Browse the complete ${storeName} collection. ${storeDescription}`
		: `Browse the complete ${storeName} collection.`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: { type: "website", title, description, url: canonical },
	};
}

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = SORT_OPTIONS.find((s) => s.value === filters.sort) ?? SORT_OPTIONS[0];

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

	if (result.data.length === 0) {
		return (
			<div className="py-24">
				<p className="font-display text-[48px] leading-[0.9]">Nothing matches</p>
				<p className="mt-3 text-muted-foreground">Try fewer filters, or see everything.</p>
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
				totalPages={Math.ceil(result.meta.count / PRODUCTS_PER_PAGE)}
				filters={filters}
			/>
		</>
	);
}

async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const [facets, sections, total] = await Promise.all([
		getFilterFacets(),
		getShopSections(),
		getCatalogCount(),
	]);

	return (
		<div className="flex min-h-svh flex-col gap-5 lg:gap-6">
			<ListingHeading title="New arrivals" count={total} />
			<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
				<SectionPills sections={sections} total={total} />
				<Suspense fallback={<ToolbarFallback />}>
					<div className="flex shrink-0 gap-1.5">
						<ProductFiltersMobile facets={facets} />
						<SortSelect options={SORT_OPTIONS} />
						<DensitySwitch />
					</div>
				</Suspense>
			</div>
			<Suspense fallback={<ListingGridSkeleton className={LISTING_GRID} />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
