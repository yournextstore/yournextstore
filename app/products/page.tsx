import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingSkeleton, ListingToolbar, listingGridClass, PageTrail } from "@/components/listing-shell";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { SortSelect } from "./products-sort-select";

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

async function ProductList({
	filters,
	facets,
	filtersAvailable,
}: {
	filters: ProductFilterParams;
	facets: Awaited<ReturnType<typeof getFilterFacets>>;
	filtersAvailable: boolean;
}) {
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
	const categoryName = facets.categories.find((category) => category.slug === filters.category)?.name;

	return (
		<>
			<ListingToolbar
				title={categoryName ?? "All Products"}
				filtersButton={filtersAvailable ? <ProductFiltersMobile facets={facets} /> : null}
				range={{
					from: result.data.length === 0 ? 0 : offset + 1,
					to: offset + result.data.length,
					total: result.meta.count,
				}}
				sort={<SortSelect options={sortOptions} />}
			/>
			{result.data.length === 0 ? (
				<div className="py-24 text-center">
					<p className="text-lg text-muted-foreground">No products match these filters.</p>
				</div>
			) : (
				<div className={listingGridClass}>
					{result.data.map((product, index) => (
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

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; `ProductList` remains cached, keyed on the resolved filters.
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	const facets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="flex min-h-svh items-start md:gap-5">
			<div className="flex w-full min-w-0 flex-col gap-5">
				<ProductList filters={filters} facets={facets} filtersAvailable={filtersAvailable} />
			</div>
			{/* After the list in the DOM so the page's h1 comes first; shown on the left like the original. */}
			{filtersAvailable && <ProductFilters facets={facets} className="md:-order-1" />}
		</div>
	);
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	return (
		<div className="frame pb-20">
			<PageTrail crumbs={[{ label: "Shop" }]} />
			<Suspense fallback={<ListingSkeleton title="All Products" />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
