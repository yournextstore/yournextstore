import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import {
	CatalogGrid,
	CatalogGridSkeleton,
	CatalogHeading,
	CatalogPagination,
	CategoryRow,
	DEFAULT_SORT,
	PRODUCTS_PER_PAGE,
	parseSort,
	SortRow,
	sortQuery,
} from "@/components/catalog";
import { getCategoryLinks, picturedFirst } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";

type ProductFilterParams = {
	page?: string;
	sort?: string;
	dir?: string;
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
	const sort = parseSort(filters);

	const result = await commerce.productBrowse({
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset,
		...sortQuery(sort),
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
			<SortRow basePath="/products" current={sort} />
			<CatalogGrid
				products={
					sort.field === DEFAULT_SORT.field && sort.dir === DEFAULT_SORT.dir
						? picturedFirst(result.data)
						: result.data
				}
			/>
			<CatalogPagination
				basePath="/products"
				currentPage={currentPage}
				totalPages={totalPages}
				params={filters}
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
	// Cached and independent of `searchParams`, so the heading and category row prerender.
	const categories = await getCategoryLinks();

	return (
		<div className="shell">
			<CatalogHeading eyebrow="Shop" title="All products" />
			<CategoryRow links={categories} />
			{/* The fallback is the default sort row plus two rows of cards: the same height the
			    real toolbar and grid take, so nothing in the viewport moves when they land. */}
			<Suspense
				fallback={
					<>
						<SortRow basePath="/products" />
						<CatalogGridSkeleton />
					</>
				}
			>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
