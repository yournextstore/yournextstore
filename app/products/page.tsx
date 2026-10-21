import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingHeader, ListingSkeleton, listingGridClass } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
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
			<div className="rounded-sm border border-border py-24 text-center">
				<p className="text-label-lg font-light text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<p className="mb-4 text-label">
				{result.meta.count} {result.meta.count === 1 ? "product" : "products"}
			</p>
			<div className={listingGridClass}>
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
		<div className="page-x min-h-svh py-4 lg:py-8">
			<ListingHeader
				crumbs={[{ href: "/", label: "Home" }, { label: "All products" }]}
				title="All products"
			/>

			{/* The filter and sort controls read useSearchParams(), so they stream in behind one
			    boundary with the grid while the chrome and the heading above prerender. */}
			<Suspense fallback={<ListingSkeleton sidebar={filtersAvailable} />}>
				<div className={filtersAvailable ? "lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-4" : ""}>
					{filtersAvailable && <ProductFilters facets={facets} />}

					<div>
						{/* Mobile/tablet toolbar: the original's black Filters button + compact Sort dropdown. */}
						<div className="mb-4 flex h-10 items-center justify-between gap-3 lg:hidden">
							{filtersAvailable ? <ProductFiltersMobile facets={facets} /> : <span />}
							<SortSelect options={sortOptions} />
						</div>

						{/* Desktop toolbar: inline sort links (filters live in the sidebar). */}
						<div className="mb-4 hidden h-10 flex-wrap items-center justify-end gap-4 text-label-sm uppercase lg:flex">
							<span className="text-muted-foreground">Sort by</span>
							<SortLinks options={sortOptions} />
						</div>

						<ProductSection searchParams={searchParams} />
					</div>
				</div>
			</Suspense>
		</div>
	);
}
