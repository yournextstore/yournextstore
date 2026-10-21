import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { CARD_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { ShopCrumbs } from "@/components/shop-crumbs";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 20;

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
	const hasPhoto = (product: (typeof result.data)[number]) => (product.images?.length ?? 0) > 0;
	const products = isDefaultSort
		? [...result.data.filter(hasPhoto), ...result.data.filter((product) => !hasPhoto(product))]
		: result.data;

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className={CARD_GRID}>
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

/** Same box as the live controls, so the toolbar does not shift when they land. */
function ToolbarFallback({ filters }: { filters: boolean }) {
	return (
		<div className="flex w-full flex-row-reverse items-center justify-between gap-4 sm:w-auto sm:flex-row">
			{filters && <div className="h-10 w-20" />}
			<div className="h-9 w-36 rounded-full border border-line" />
		</div>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// `facets` is cached and independent of `searchParams`, so it can drive the layout
	// shell without making the route blocking. Runtime `searchParams` is read inside the
	// Suspense boundaries below (see `ProductSection`).
	const facets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="min-h-svh">
			<h1 className="sr-only">All products</h1>
			<ShopCrumbs trail={[{ href: "/", label: "Home" }]} current="Shop" className="flex-wrap max-sm:gap-y-3">
				<div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
					<Suspense fallback={<ToolbarFallback filters={filtersAvailable} />}>
						<div className="flex w-full flex-row-reverse items-center justify-between gap-4 sm:w-auto sm:flex-row">
							{filtersAvailable && <ProductFiltersMobile facets={facets} />}
							<SortSelect options={sortOptions} className="rounded-full border-line" />
						</div>
					</Suspense>
				</div>
			</ShopCrumbs>
			<div className="frame pt-3 md:pt-5">
				<Suspense fallback={<ProductGridSkeleton />}>
					<ProductSection searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	);
}
