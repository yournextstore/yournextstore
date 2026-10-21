import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { Em } from "@/components/brand/em";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ListingSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { SortLinks, SortSelect } from "./products-sort-select";

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

	if (result.data.length === 0) {
		return (
			<div className="max-w-md py-16">
				<p className="font-display text-title-sm">Nothing matches these filters</p>
				<p className="mt-3 text-muted-foreground">Try a wider price range or another category.</p>
				<Link href="/products" className="btn-line mt-8">
					Clear filters
				</Link>
			</div>
		);
	}

	return (
		<>
			<p className="mb-8 text-sm text-muted-foreground">
				{result.meta.count} {result.meta.count === 1 ? "product" : "products"}
			</p>
			<div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
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
		<div className="container-page pb-20 pt-14 md:pb-28 md:pt-18">
			<div className="mb-12">
				<h1 className="font-display text-title-xl md:text-[3.75rem] md:leading-[1.05]">
					The <Em>shelf</Em>
				</h1>
			</div>

			{/* The filter and sort controls read useSearchParams(), so they stream in behind one
			    boundary with the grid while the chrome and the heading above prerender. */}
			<Suspense fallback={<ListingSkeleton filters={filtersAvailable} />}>
				<div className={filtersAvailable ? "lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10" : ""}>
					{filtersAvailable && <ProductFilters facets={facets} />}

					<div>
						{/* Mobile/tablet toolbar: Filters button + compact Sort dropdown (sidebar is hidden below lg). */}
						<div className="mb-8 flex items-center justify-between gap-3 lg:hidden">
							{filtersAvailable ? <ProductFiltersMobile facets={facets} /> : <span />}
							<SortSelect options={sortOptions} />
						</div>

						{/* Desktop toolbar: inline sort links (filters live in the sidebar). */}
						<div className="mb-6 hidden flex-wrap items-center gap-x-5 gap-y-2 lg:flex">
							<span className="eyebrow">Sort by</span>
							<SortLinks options={sortOptions} />
						</div>

						<ProductSection searchParams={searchParams} />
					</div>
				</div>
			</Suspense>
		</div>
	);
}
