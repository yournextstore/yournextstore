import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import {
	ListingHeading,
	ListingResults,
	ListingSkeleton,
	PRODUCTS_PER_PAGE,
} from "@/components/swag/listing";
import { commerce, getStoreSeo } from "@/lib/commerce";

const sortOptions = [
	{ value: "newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", orderBy: "price", orderDirection: "desc" },
	{ value: "name", orderBy: "name", orderDirection: "asc" },
] as const;

type ProductFilterParams = {
	page?: string;
	sort?: string;
	view?: string;
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
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];

	const result = await commerce.productBrowse({
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});

	return (
		<ListingResults
			products={result.data}
			view={filters.view === "list" ? "list" : "grid"}
			currentPage={currentPage}
			totalCount={result.meta.count}
			basePath="/products"
			query={filters}
		/>
	);
}

// Awaits `searchParams` inside the Suspense boundary so the heading and chrome prerender.
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	return (
		<div className="bg-swag-paper">
			<ListingHeading />
			<Suspense fallback={<ListingSkeleton basePath="/products" />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
