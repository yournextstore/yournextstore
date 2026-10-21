import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { Crumbs } from "@/components/crumbs";
import {
	EmptyListing,
	ListingGrid,
	ListingShell,
	ListingSkeleton,
	ListingToolbar,
	TitlePanel,
} from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { picturedFirst } from "@/lib/catalog";
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

async function ProductList({
	filters,
	facets,
	filtersAvailable,
}: {
	filters: ProductFilterParams;
	facets: Facets;
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

	return (
		<>
			<ListingToolbar count={result.meta.count}>
				{filtersAvailable ? <ProductFiltersMobile facets={facets} /> : null}
				<SortSelect options={sortOptions} />
			</ListingToolbar>
			{result.data.length === 0 ? (
				<EmptyListing />
			) : (
				<ListingGrid>
					{(filters.sort ? result.data : picturedFirst(result.data)).map((product, index) => (
						<ProductCard
							key={product.id}
							product={product}
							priority={index === 0}
							sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
						/>
					))}
				</ListingGrid>
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
	filtersAvailable,
}: {
	searchParams: Promise<ProductFilterParams>;
	facets: Facets;
	filtersAvailable: boolean;
}) {
	const filters = await searchParams;
	return <ProductList filters={filters} facets={facets} filtersAvailable={filtersAvailable} />;
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
		<ListingShell
			crumbs={<Crumbs items={[{ href: "/", label: "Home" }, { label: "Shop" }]} />}
			sidebar={
				filtersAvailable ? (
					<Suspense fallback={null}>
						<ProductFilters facets={facets} />
					</Suspense>
				) : null
			}
			title={
				<TitlePanel title="All Products" text="Browse the complete range, filtered and sorted your way." />
			}
		>
			{/* The toolbar and grid read the search params, so they stream in behind one boundary
			    whose fallback has the same boxes; the chrome, title and sidebar prerender. */}
			<Suspense fallback={<ListingSkeleton />}>
				<ProductSection searchParams={searchParams} facets={facets} filtersAvailable={filtersAvailable} />
			</Suspense>
		</ListingShell>
	);
}
