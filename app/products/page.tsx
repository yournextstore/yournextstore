import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import {
	FilterButtonFallback,
	ListingBody,
	ListingEmpty,
	ListingHeader,
	ListingSkeleton,
	ListingToolbar,
	listingGridClass,
} from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { type FilterFacets, getFilterFacets } from "@/lib/facets";
import { SortSelect } from "./products-sort-select";

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

	return (
		<>
			<ListingToolbar count={result.meta.count} sort={<SortSelect options={sortOptions} />} />
			<ListingBody>
				{result.data.length === 0 ? (
					<ListingEmpty>No products match these filters.</ListingEmpty>
				) : (
					<ul className={listingGridClass}>
						{result.data.map((product, index) => (
							<li key={product.id}>
								<ProductCard
									product={product}
									priority={index < 2}
									sizes="(min-width: 768px) 50vw, (min-width: 640px) 50vw, 100vw"
								/>
							</li>
						))}
					</ul>
				)}
				<ListingPagination
					basePath="/products"
					currentPage={currentPage}
					totalPages={totalPages}
					filters={filters}
				/>
			</ListingBody>
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
	// `facets` are cached and independent of `searchParams`, so they can drive the shell.
	const facets: FilterFacets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="shell min-h-svh">
			<ListingHeader
				title="All products"
				filters={
					filtersAvailable ? (
						<Suspense fallback={<FilterButtonFallback />}>
							<ProductFiltersMobile facets={facets} />
						</Suspense>
					) : null
				}
			/>
			{/* Toolbar and grid read the URL, so they stream in behind one boundary while the
			    chrome and the header above prerender. */}
			<Suspense fallback={<ListingSkeleton />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
