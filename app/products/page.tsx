import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingHead, listingGrid } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductCarousel } from "@/components/sections/product-carousel";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { type Facets, ListingToolbar, ListingToolbarSkeleton, sortOptions } from "./listing-toolbar";

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

async function browseProducts(filters: ProductFilterParams) {
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

	return { products: result.data, count: result.meta.count, currentPage };
}

async function getRecommended() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce.productBrowse({ active: true, limit: 9 }).catch(() => ({ data: [] }));
	return result.data;
}

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; the catalog read stays cached, keyed on the resolved filters.
async function ProductSection({
	searchParams,
	facets,
}: {
	searchParams: Promise<ProductFilterParams>;
	facets: Facets | null;
}) {
	const filters = await searchParams;
	const { products, count, currentPage } = await browseProducts(filters);
	const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE);

	return (
		<div className="flex flex-col gap-8">
			<ListingToolbar facets={facets} count={count} />
			{products.length === 0 ? (
				<p className="py-10 text-center text-lead text-muted-foreground">No products.</p>
			) : (
				<div className={listingGrid}>
					{products.map((product, index) => (
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
		</div>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// `facets` is cached and independent of `searchParams`, so it can drive the layout
	// shell without making the route blocking. Runtime `searchParams` is read inside the
	// Suspense boundary below (see `ProductSection`).
	const [facets, recommended] = await Promise.all([getFilterFacets(), getRecommended()]);
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<>
			<ListingHead crumbs={[{ href: "/", label: "Home Page" }, { label: "Shop" }]} title="All products" />
			<div className="shell min-h-svh pt-12 pb-8">
				{/* The filter and sort controls read useSearchParams(), so they stream in behind one
				    boundary with the grid while the chrome and the heading above prerender. */}
				<Suspense
					fallback={
						<div className="flex min-h-svh flex-col gap-8">
							<ListingToolbarSkeleton />
							<ProductGridSkeleton />
						</div>
					}
				>
					<ProductSection searchParams={searchParams} facets={filtersAvailable ? facets : null} />
				</Suspense>
			</div>
			<ProductCarousel title="Recommended products" products={recommended} />
		</>
	);
}
