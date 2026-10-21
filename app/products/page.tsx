import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { EmptyListing } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { headingSizes } from "@/components/munch/styles";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton, productGridClass } from "@/components/product-grid-skeleton";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { sortOptions } from "@/lib/sort";
import { ListingToolbar, ListingToolbarSkeleton } from "./listing-toolbar";

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
		return <EmptyListing />;
	}

	return (
		<>
			<div className={productGridClass}>
				{result.data.map((product, index) => (
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
	// `facets` is cached and independent of `searchParams`. Runtime `searchParams` is read inside
	// the Suspense boundary below, together with the toolbar that reads useSearchParams().
	const facets = await getFilterFacets();

	return (
		<section className="shell flex min-h-svh flex-col gap-10 pt-26 pb-10">
			<h1 className={headingSizes.page}>Shop all products</h1>
			<Suspense
				fallback={
					<div className="flex flex-col gap-6">
						<ListingToolbarSkeleton />
						<ProductGridSkeleton count={9} />
					</div>
				}
			>
				<div className="flex flex-col gap-6">
					<ListingToolbar collections={facets.collections} categories={facets.categories} />
					<ProductSection searchParams={searchParams} />
				</div>
			</Suspense>
		</section>
	);
}
