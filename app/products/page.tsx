import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { CountLabel, FeatureRow, SideNav, shopEntries } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { getShelf } from "@/lib/catalog";
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

type Facets = Awaited<ReturnType<typeof getFilterFacets>>;

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

	return { result, currentPage, totalPages };
}

function Toolbar({
	facets,
	filtersAvailable,
	count,
}: {
	facets: Facets;
	filtersAvailable: boolean;
	count: number;
}) {
	return (
		<div className="mb-6 flex min-h-9 flex-wrap items-center justify-between gap-x-3 gap-y-4">
			<div className="w-full sm:w-auto">
				<CountLabel label="All products" count={count} />
			</div>
			{filtersAvailable ? (
				<ProductFiltersMobile facets={facets} showCategories={false} showCollections={false} />
			) : (
				<span />
			)}
			<SortSelect options={sortOptions} className="sm:ml-auto" />
		</div>
	);
}

// Same box as the toolbar, without the controls that read searchParams.
function ToolbarSkeleton({ filtersAvailable }: { filtersAvailable: boolean }) {
	return (
		<div className="mb-6 flex min-h-9 flex-wrap items-center justify-between gap-x-3 gap-y-4">
			<div className="flex h-[1.125rem] w-full items-center sm:w-auto">
				<span className="h-4 w-28 animate-pulse rounded bg-sand" />
			</div>
			{filtersAvailable ? (
				<span className="h-8 w-[5.5rem] rounded-md border border-input lg:hidden" />
			) : (
				<span />
			)}
			<span className="h-8 w-36 rounded-md border border-input sm:ml-auto" />
		</div>
	);
}

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; `ProductList` remains cached, keyed on the resolved filters.
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
	const { result, currentPage, totalPages } = await ProductList({ filters });

	return (
		<>
			<Toolbar facets={facets} filtersAvailable={filtersAvailable} count={result.meta.count} />
			{result.data.length === 0 ? (
				<div className="py-24 text-center">
					<p className="text-copy text-plum">No products match these filters.</p>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8">
					{result.data.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
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

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// `facets` and the shelf are cached and independent of `searchParams`, so they drive the
	// layout shell without making the route blocking. Runtime `searchParams` is read inside the
	// Suspense boundary below (see `ProductSection`).
	const [facets, shelf] = await Promise.all([getFilterFacets(), getShelf()]);
	const filtersAvailable =
		facets.variantTypes.length > 0 || facets.brands.length > 0 || facets.priceBounds.max > 0;

	return (
		<div className="min-h-svh px-6 pb-20 pt-6 lg:px-8">
			<h1 className="text-copy font-semibold text-ink">All Products</h1>
			<FeatureRow cards={shelf} activeHref="/products" />

			<div className="mt-6 border-t border-rule pt-4 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
				<aside className="space-y-8">
					<SideNav entries={shopEntries(facets)} active="/products" />
					{filtersAvailable && (
						<Suspense>
							<ProductFilters facets={facets} showCategories={false} showCollections={false} />
						</Suspense>
					)}
				</aside>

				<div className="min-w-0">
					{/* The toolbar and the grid read searchParams, so they stream in behind one boundary;
					    the fallback has the same toolbar row so nothing shifts when they land. */}
					<Suspense
						fallback={
							<>
								<ToolbarSkeleton filtersAvailable={filtersAvailable} />
								<ProductGridSkeleton />
							</>
						}
					>
						<ProductSection searchParams={searchParams} facets={facets} filtersAvailable={filtersAvailable} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
