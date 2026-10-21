import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingHeading, ListingToolbar, ListingToolbarSkeleton } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCategories } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { SORT_OPTIONS } from "@/lib/sort";

const PRODUCTS_PER_PAGE = 16;

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
	const sortOption = SORT_OPTIONS.find((s) => s.value === filters.sort) ?? SORT_OPTIONS[0];

	const [result, categories, facets] = await Promise.all([
		commerce.productBrowse({
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
		}),
		getCategories(),
		getFilterFacets(),
	]);

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<ListingToolbar
				categories={categories}
				currentCategory={filters.category}
				facets={facets}
				count={result.meta.count}
			/>
			{result.data.length === 0 ? (
				<p className="cap-tag py-20 text-center text-faint">Nothing matches those filters.</p>
			) : (
				<div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
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
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	return (
		<div className="mx-auto min-h-svh max-w-[1640px] px-4 pt-6 sm:px-5 sm:pt-8 lg:px-9">
			<ListingHeading crumbs={[{ label: "Shop" }]} title="Shop all" />
			{/* Toolbar and grid read the URL, so they stream in behind one boundary; the heading above prerenders. */}
			<Suspense
				fallback={
					<>
						<ListingToolbarSkeleton />
						<ProductGridSkeleton />
					</>
				}
			>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
