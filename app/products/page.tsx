import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import {
	ListingHeading,
	ListingResults,
	ListingResultsSkeleton,
	ListingShell,
	PriceChips,
	presentBuckets,
} from "@/components/bento/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { getCatalogProducts, picturedFirst } from "@/lib/aqua";
import { commerce, getStoreSeo } from "@/lib/commerce";
import {
	getListingSort,
	getPriceBucket,
	lowestPrice,
	priceBrowseParams,
	sortBrowseParams,
} from "@/lib/listing";

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
	price?: string;
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

const heading = <ListingHeading title="All products">Everything we stock, in one place.</ListingHeading>;

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const sort = getListingSort(filters.sort);
	const bucket = getPriceBucket(filters.price);

	const [result, catalog] = await Promise.all([
		commerce.productBrowse({
			active: true,
			limit: PRODUCTS_PER_PAGE,
			offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
			...sortBrowseParams(sort),
			category: filters.category,
			collection: filters.collection,
			brand: filters.brand,
			...(bucket
				? priceBrowseParams(bucket)
				: {
						priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
						priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
					}),
			vts: filters.vts,
		}),
		getCatalogProducts(),
	]);
	const query = { sort: filters.sort, price: bucket?.slug };

	return (
		<ListingResults
			products={sort.orderBy ? result.data : picturedFirst(result.data)}
			basePath="/products"
			sort={sort}
			query={query}
			empty="No products match these filters. Try clearing one."
			before={
				<>
					{heading}
					<PriceChips
						basePath="/products"
						buckets={presentBuckets(catalog.products.map(lowestPrice).filter((price) => price > 0))}
						query={query}
					/>
				</>
			}
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
		<ListingShell activePath="/products">
			<Suspense fallback={<ListingResultsSkeleton before={heading} />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</ListingShell>
	);
}
