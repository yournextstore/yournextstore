import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { CatalogNav, EmptyResults, ListingShell, ToolbarFallback } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { PageHeading } from "@/components/page-heading";
import { LISTING_CELLS, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { ProductCells } from "@/components/sections/product-grid";
import { getCatalogEntries, getProductCount } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { itemsLabel } from "@/lib/display";
import { getFilterFacets } from "@/lib/facets";
import { SortLinks } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", label: "newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "price ↑", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "price ↓", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "name", orderBy: "name", orderDirection: "asc" },
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

	if (result.data.length === 0) {
		return <EmptyResults>No products match these filters.</EmptyResults>;
	}

	return (
		<>
			<ProductCells headingLevel="h2" products={result.data} className={LISTING_CELLS} />

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
	// `facets`, catalog entries and the count are cached and independent of `searchParams`, so they
	// drive the shell; runtime `searchParams` is read inside the Suspense boundaries below.
	const [facets, entries, count] = await Promise.all([
		getFilterFacets(),
		getCatalogEntries(),
		getProductCount(),
	]);
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;
	const hasCategories = entries.some((entry) => entry.href.startsWith("/category/"));

	return (
		<div className="min-h-svh">
			<PageHeading
				crumbs={[{ href: "/", label: "Home" }, { label: "Catalog" }]}
				title="Catalog"
				subtitle={itemsLabel(count)}
			/>
			<ListingShell
				sidebar={
					<>
						<CatalogNav
							entries={entries}
							activeHref="/products"
							title={hasCategories ? "Categories" : "Collections"}
						/>
						{filtersAvailable && (
							<Suspense>
								<ProductFilters
									facets={facets}
									showCategories={!hasCategories}
									showCollections={hasCategories}
								/>
							</Suspense>
						)}
					</>
				}
				toolbar={
					<Suspense fallback={<ToolbarFallback withFilters={filtersAvailable} />}>
						<SortLinks options={sortOptions} />
						{filtersAvailable && <ProductFiltersMobile facets={facets} />}
					</Suspense>
				}
			>
				<Suspense fallback={<ProductGridSkeleton count={PRODUCTS_PER_PAGE} className={LISTING_CELLS} />}>
					<ProductSection searchParams={searchParams} />
				</Suspense>
			</ListingShell>
		</div>
	);
}
