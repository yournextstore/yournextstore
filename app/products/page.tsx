import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { BrushHeadline, ListingBanner } from "@/components/listing-banner";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { getCollections, getStoreInfo, PHOTOS, picturedFirst } from "@/lib/catalog";
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

	// Under the default order, pictured pieces lead the page so an image-less product never opens the grid.
	const isDefaultSort = !filters.sort || filters.sort === sortOptions[0].value;
	const products = isDefaultSort ? picturedFirst(result.data) : result.data;

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-steel">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<h2 className="sr-only">Products</h2>
			<div className={LISTING_GRID}>
				{products.map((product, index) => (
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

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; `ProductList` remains cached, keyed on the resolved filters.
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

async function getBannerData() {
	"use cache";
	cacheLife("hours");
	const [{ storeName }, collections] = await Promise.all([getStoreInfo(), getCollections()]);
	const tagline = collections
		.slice(0, 3)
		.map((c) => `${c.name}.`)
		.join(" ");
	return {
		storeName,
		tagline: tagline || null,
		image: PHOTOS.listing,
	};
}

function ToolbarSkeleton() {
	return (
		<div className="mb-6 flex items-center justify-between gap-4">
			<div className="h-12 w-[8.5rem] rounded-md border border-input" />
			<div className="h-12 w-[10.5rem] rounded-md border border-input xs:w-[13rem] sm:w-[19.5rem]" />
		</div>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// `facets` is cached and independent of `searchParams`, so it can drive the layout
	// shell without making the route blocking. Runtime `searchParams` is read inside the
	// Suspense boundary below (see `ProductSection`).
	const [facets, banner] = await Promise.all([getFilterFacets(), getBannerData()]);
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<>
			<ListingBanner image={banner.image} align="end">
				<BrushHeadline lines={["Shop the full", `${banner.storeName} range`]} />
				{banner.tagline && (
					<p className="mt-5 max-w-xl text-base font-semibold text-white sm:text-lg">{banner.tagline}</p>
				)}
			</ListingBanner>

			<div className="mx-auto min-h-svh max-w-[68rem] px-4 py-10 sm:px-6">
				{/* The filter and sort controls read useSearchParams(), so they stream in behind one
				    boundary with the grid while the chrome and the banner above prerender. */}
				<Suspense
					fallback={
						<>
							<ToolbarSkeleton />
							<ProductGridSkeleton />
						</>
					}
				>
					<div className="mb-6 flex items-center justify-between gap-4">
						{filtersAvailable ? (
							<ProductFiltersMobile
								facets={facets}
								label="All Filters"
								triggerClassName="h-12 gap-3 rounded-md border-input bg-transparent px-4 text-sm font-normal text-ink shadow-none hover:bg-secondary"
							/>
						) : (
							<span />
						)}
						<div className="flex items-center gap-3">
							<span className="hidden border-b-2 border-ink pb-0.5 text-sm text-ink sm:inline">Sort by:</span>
							<SortSelect
								options={sortOptions}
								className="h-12! w-[10.5rem] rounded-md border-input bg-[#f4f6f9] px-4 text-ink shadow-none xs:w-[13rem] sm:w-[15rem]"
							/>
						</div>
					</div>

					<ProductSection searchParams={searchParams} />
				</Suspense>
			</div>
		</>
	);
}
