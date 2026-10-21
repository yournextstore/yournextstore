import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { Heading } from "@/components/heading";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingToolbar, ListingToolbarSkeleton } from "@/components/listing-toolbar";
import { CARD_GRID, ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { Separator } from "@/components/separator";
import { photographedFirst } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFacetControls } from "@/lib/listing";
import { findSort } from "@/lib/sort";

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
	const sortOption = findSort(filters.sort);

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
			<div className="rounded-lg border bg-card p-4 shadow-sm">
				<p>No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className={CARD_GRID}>
				{(filters.sort ? result.data : photographedFirst(result.data)).map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
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
	const facets = await getFacetControls();

	return (
		<div className="min-h-svh pt-4 page-x">
			<Heading
				as="h1"
				title="Products"
				description="Below is a list of products we have available for you."
				className="mt-0"
			/>
			<Suspense fallback={<ListingToolbarSkeleton count={facets.length} />}>
				<ListingToolbar facets={facets} />
			</Suspense>
			<Separator />
			<Suspense fallback={<ProductGridSkeleton count={12} />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
