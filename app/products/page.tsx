import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { ListingHeader } from "@/components/listing-header";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { btnSecondaryClass } from "@/lib/styles";
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
	// Under the default order, pictured, priced products lead the page; image-less or zero-priced ones close it.
	const pictured = (p: (typeof result.data)[number]) =>
		(p.images?.length ?? 0) > 0 && p.variants.some((v) => Number(v.price) > 0);
	const products = filters.sort
		? result.data
		: [...result.data.filter(pictured), ...result.data.filter((p) => !pictured(p))];

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="font-display text-3xl text-earth-soft">No products found</p>
				<p className="mt-2 font-body text-sm text-earth-soft">Try adjusting your filters</p>
				<Link href="/products" className={`${btnSecondaryClass} mt-6`}>
					Clear Filters
				</Link>
			</div>
		);
	}

	return (
		<>
			<p className="mb-6 font-body text-sm text-earth-soft">
				{result.meta.count} {result.meta.count === 1 ? "product" : "products"} found
			</p>
			<h2 className="sr-only">Products</h2>
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				{products.map((product, index) => (
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
	// `facets` is cached and independent of `searchParams`, so it can drive the layout
	// shell without making the route blocking. Runtime `searchParams` is read inside the
	// Suspense boundary below (see `ProductSection`).
	const facets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="min-h-svh">
			<ListingHeader eyebrow="All Collections" title="Products">
				Browse the complete collection.
			</ListingHeader>

			<div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-12">
				{/* The filter and sort controls read useSearchParams(), so they stream in behind one
				    boundary with the grid while the chrome and the band above prerender. */}
				<Suspense fallback={<ListingSkeleton />}>
					<div className={filtersAvailable ? "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12" : ""}>
						{filtersAvailable && (
							<ProductFilters facets={facets} className="lg:sticky lg:top-28 lg:self-start" />
						)}

						<div className="min-w-0">
							<div className="mb-6 flex items-center justify-between gap-3">
								{filtersAvailable ? <ProductFiltersMobile facets={facets} /> : <span />}
								<SortSelect options={sortOptions} className="ml-auto" />
							</div>

							<ProductSection searchParams={searchParams} />
						</div>
					</div>
				</Suspense>
			</div>
		</div>
	);
}

function ListingSkeleton() {
	return (
		<div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
			<div className="hidden space-y-3 lg:block">
				<div className="h-4 w-24 rounded bg-sand" />
				<div className="h-9 w-full rounded-md bg-sand/70" />
				<div className="h-9 w-full rounded-md bg-sand/70" />
				<div className="h-9 w-full rounded-md bg-sand/70" />
			</div>
			<div>
				<div className="mb-6 flex h-9 items-center justify-between">
					<div className="h-9 w-24 rounded-md border border-input lg:invisible" />
					<div className="h-9 w-36 rounded-md border border-input" />
				</div>
				<div className="mb-6 h-5 w-32 rounded bg-sand" />
				<ProductGridSkeleton />
			</div>
		</div>
	);
}
