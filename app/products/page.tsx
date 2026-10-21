import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingResults, ListingResultsSkeleton, ListingShell } from "@/components/bento/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getListingSort, sortBrowseParams } from "@/lib/listing";

const PRODUCTS_PER_PAGE = 24;

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
		openGraph: { type: "website", title, description, url: canonical },
	};
}

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const sort = getListingSort(filters.sort);

	const result = await commerce.productBrowse({
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
		...sortBrowseParams(sort),
		category: filters.category,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});

	return (
		<ListingResults
			products={result.data}
			basePath="/products"
			sort={sort}
			empty="No products match these filters."
			after={
				<ListingPagination
					basePath="/products"
					currentPage={currentPage}
					totalPages={Math.ceil(result.meta.count / PRODUCTS_PER_PAGE)}
					filters={filters}
				/>
			}
		/>
	);
}

async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	return (
		<ListingShell title="All products" activePath="/products">
			<Suspense fallback={<ListingResultsSkeleton />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</ListingShell>
	);
}
