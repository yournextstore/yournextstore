import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingTabs } from "@/components/listing-tabs";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { SectionHeader } from "@/components/sections/home";
import { commerce, getStoreSeo } from "@/lib/commerce";
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

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const { result, currentPage } = await getProductPage(filters);
	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);
	// Under the default order, pictured, priced products lead the page; image-less or zero-priced ones close it.
	const pictured = (p: (typeof result.data)[number]) =>
		(p.images?.length ?? 0) > 0 && p.variants.some((v) => Number(v.price) > 0);
	const products = filters.sort
		? result.data
		: [...result.data.filter(pictured), ...result.data.filter((p) => !pictured(p))];

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="serif text-[1.8rem] text-ink">Nothing matches that just yet.</p>
			</div>
		);
	}

	return (
		<>
			<div className={LISTING_GRID}>
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 1} />
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
		<div className="container-x min-h-svh pb-[100px] pt-16 md:pt-20">
			<SectionHeader
				as="h1"
				eyebrow="Find your feeling"
				title={
					<>
						Shop <i>everything</i>
					</>
				}
				copy="Choose something for the moment, from a small posy to a generous seasonal bunch."
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
