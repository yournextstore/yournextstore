import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingEmpty, ListingGrid, ListingHeader } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { picturedFirst } from "@/lib/pictured";
import { getShopIndex } from "@/lib/shop-index";
import { SortLinks } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 24;

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price, low to high", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price, high to low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name", orderBy: "name", orderDirection: "asc" },
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
		return <ListingEmpty>Nothing here yet.</ListingEmpty>;
	}

	return (
		<>
			<ListingGrid products={sortOption.value === "newest" ? picturedFirst(result.data) : result.data} />

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
	// Cached and independent of `searchParams`, so the index of collections and categories
	// prerenders with the heading; runtime `searchParams` is read inside the Suspense below.
	const facets = await getShopIndex();
	const links = [
		...facets.collections.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		...facets.categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
	];

	return (
		<div className="pb-6 md:pb-12">
			<ListingHeader title="Shop" links={links} />

			{/* The sort links read useSearchParams(), so they stream in behind one boundary with the
			    grid while the chrome and the heading above prerender. The fallback reserves the
			    sort line too. */}
			<Suspense
				fallback={
					<>
						<div className="mb-6 h-10 md:mb-8 md:h-6" />
						<ProductGridSkeleton />
					</>
				}
			>
				<div className="mb-6 min-h-10 md:mb-8 md:min-h-6">
					<SortLinks options={sortOptions} />
				</div>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
