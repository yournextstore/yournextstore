import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingTabs } from "@/components/listing-tabs";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { SectionHead } from "@/components/sections/home";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";
import { SortPlaceholder, SortSelect } from "./products-sort-select";

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

async function getProductPage(filters: ProductFilterParams) {
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
	return { result, currentPage };
}

// On the default order, photographed pieces lead the page so it never opens on an empty frame.
function picturedFirst<T extends { images?: readonly string[] | null }>(products: T[]): T[] {
	const pictured = (p: T) => (p.images?.some((image) => !isVideoUrl(image)) ? 0 : 1);
	return [...products].sort((a, b) => pictured(a) - pictured(b));
}

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const { result, currentPage } = await getProductPage(filters);
	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="font-display text-[1.8rem] text-ink">Nothing on this page yet.</p>
				<p className="mono mt-2 text-[0.75rem] text-faint">try another ruling — or another filter</p>
			</div>
		);
	}

	return (
		<>
			<div className={LISTING_GRID}>
				{(filters.sort ? result.data : picturedFirst(result.data)).map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 1} as="h2" />
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
// stays prerenderable.
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	return (
		<div className="wrap min-h-svh pb-[clamp(4rem,9vw,7rem)] pt-[clamp(2.5rem,6vw,4.5rem)]">
			<SectionHead
				as="h1"
				reveal={false}
				kicker="The range"
				title={
					<>
						Everything worth <em>living with.</em>
					</>
				}
				lede="Every notebook, pen and sheet we stock, on one long page. Filter by shelf, sort by price, and open any card for its own page."
			/>
			<ListingTabs>
				<Suspense fallback={<SortPlaceholder />}>
					<SortSelect options={sortOptions} />
				</Suspense>
			</ListingTabs>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
