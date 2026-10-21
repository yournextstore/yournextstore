import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { EmptyResults } from "@/components/listing/empty-results";
import { ListingGrid, ListingLayout, ListingSkeleton } from "@/components/listing/listing-layout";
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

async function getProductList(filters: ProductFilterParams) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];

	return commerce.productBrowse({
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
		category: filters.category,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});
}

// Awaits `searchParams` (runtime data) inside the Suspense boundary so the page shell stays
// prerenderable; the browse and the facets are cached reads keyed on the resolved filters.
async function ProductsContent({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	const [facets, result] = await Promise.all([getFilterFacets(), getProductList(filters)]);
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;
	const currentPage = Math.max(1, Number(filters.page) || 1);
	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<ListingLayout
			title="All Products"
			count={result.meta.count}
			crumbs={[
				{ label: "Home", href: "/" },
				{ label: "All Products", href: "/products" },
			]}
			filters={filtersAvailable ? <ProductFilters facets={facets} /> : null}
			mobileFilters={filtersAvailable ? <ProductFiltersMobile facets={facets} /> : null}
			sort={<SortSelect options={sortOptions} />}
		>
			{result.data.length === 0 ? (
				<EmptyResults />
			) : (
				<>
					<ListingGrid>
						{picturedFirst(result.data).map((product, index) => (
							<ProductCard key={product.id} product={product} priority={index < 3} headingLevel="h2" />
						))}
					</ListingGrid>
					<ListingPagination
						basePath="/products"
						currentPage={currentPage}
						totalPages={totalPages}
						filters={filters}
					/>
				</>
			)}
		</ListingLayout>
	);
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	return (
		<Suspense fallback={<ListingSkeleton />}>
			<ProductsContent searchParams={searchParams} />
		</Suspense>
	);
}
