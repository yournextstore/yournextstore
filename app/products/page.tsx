import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingEmpty, ListingHeader, ListingSkeleton, ListingToolbar } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 16;

const sortOptions = [
	{ value: "newest", label: "Featured", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: low to high", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: high to low", orderBy: "price", orderDirection: "desc" },
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

type FacetsLike = Awaited<ReturnType<typeof getFilterFacets>>;

async function ProductList({ filters, facets }: { filters: ProductFilterParams; facets: FacetsLike }) {
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
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<>
			<ListingToolbar
				start={
					<>
						{filtersAvailable && <ProductFiltersMobile facets={facets} />}
						<span className="text-small text-muted-foreground">
							{result.meta.count} {result.meta.count === 1 ? "piece" : "pieces"}
						</span>
					</>
				}
				end={
					<>
						<span className="hidden text-small text-muted-foreground sm:inline">Sort</span>
						<SortSelect options={sortOptions} />
					</>
				}
			/>
			{result.data.length === 0 ? (
				<ListingEmpty />
			) : (
				<div className="grid grid-cols-2 gap-5 md:grid-cols-4">
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
async function ProductSection({
	searchParams,
	facets,
}: {
	searchParams: Promise<ProductFilterParams>;
	facets: FacetsLike;
}) {
	const filters = await searchParams;
	return <ProductList filters={filters} facets={facets} />;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// `facets` is cached and independent of `searchParams`; the toolbar and grid read the
	// URL, so they stream in behind one boundary while the heading and tabs prerender.
	const facets = await getFilterFacets();

	return (
		<div className="min-h-svh pb-4 sm:pb-8">
			<ListingHeader
				title="All pieces"
				description="Everything in the shop, in one place."
				activeHref="/products"
			/>
			<section className="mx-auto max-w-6xl px-5">
				<Suspense fallback={<ListingSkeleton />}>
					<ProductSection searchParams={searchParams} facets={facets} />
				</Suspense>
			</section>
		</div>
	);
}
