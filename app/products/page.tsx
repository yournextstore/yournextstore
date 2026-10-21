import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { CollectionHeader } from "@/components/listing/collection-header";
import { LISTING_GRID, ListingBody, ListingBodySkeleton } from "@/components/listing/listing-body";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { EDITORIAL, getCatalog } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { sortOptions } from "@/lib/sort";

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
			<div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border p-6 text-center">
				<p className="text-xl font-semibold tracking-tight">No products match your filters</p>
				<p>Change your filters or try again later</p>
			</div>
		);
	}

	return (
		<>
			<div className={LISTING_GRID}>
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} actions />
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
	const [facets, catalog, { storeName, storeDescription }] = await Promise.all([
		getFilterFacets(),
		getCatalog(),
		getStoreSeo(),
	]);
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="mx-auto max-w-[1400px] p-6">
			<CollectionHeader
				heading="Products"
				image={EDITORIAL.listing}
				paragraphs={[
					storeDescription ||
						`Everything ${storeName} sells, in one place: ${catalog.productCount} products across ${catalog.collections.length} collections.`,
					"Narrow the list by category, collection or price with the filters, sort it the way you like, and open any product for photos and details. Delivery options and costs are shown at checkout.",
				]}
			/>

			{/* The filter and sort controls read useSearchParams(), so they stream in behind one
			    boundary with the grid while the chrome and the header card above prerender. */}
			<Suspense fallback={<ListingBodySkeleton withFilters={filtersAvailable} />}>
				<ListingBody facets={filtersAvailable ? facets : null}>
					<ProductSection searchParams={searchParams} />
				</ListingBody>
			</Suspense>
		</div>
	);
}
