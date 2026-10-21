import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { chipRowClass, toolbarClass } from "@/components/njx/catalog-styles";
import { CollectionPills } from "@/components/njx/collection-pills";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { getCollections, getTopCategories, photographedFirst } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { CategoryChips, SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: low to high", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: high to low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name A–Z", orderBy: "name", orderDirection: "asc" },
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
			<p className="py-10 text-center text-muted-foreground sm:py-16">No products match these filters.</p>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 md:grid-cols-4">
				{(sortOption.value === "newest" ? photographedFirst(result.data) : result.data).map(
					(product, index) => (
						<ProductCard key={product.id} product={product} priority={index < 2} headingLevel="h2" />
					),
				)}
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

function ToolbarSkeleton() {
	return (
		<>
			<div className={toolbarClass}>
				<div className="h-8 w-56 max-w-full animate-pulse rounded-full bg-tile sm:h-9" />
				<div className="h-9 w-40 animate-pulse rounded-md bg-tile" />
			</div>
			<ProductGridSkeleton count={8} />
		</>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// Cached and independent of `searchParams`, so they stay in the prerendered shell. Runtime
	// `searchParams` is read inside the Suspense boundary below (see `ProductSection`).
	const [facets, collections, categories] = await Promise.all([
		getFilterFacets(),
		getCollections(),
		getTopCategories(),
	]);
	const filtersAvailable =
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="min-h-svh">
			<section className="mx-auto max-w-6xl px-5 pt-5 md:pt-6">
				<h1 className="font-display text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight">
					All products
				</h1>
				<p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
					Everything in the shop, in one place. Narrow it down by category, or sort by price.
				</p>
				<CollectionPills collections={collections} />
			</section>

			<section className="mx-auto max-w-6xl px-5 pb-4 sm:pb-8">
				{/* The toolbar reads useSearchParams(), so it streams in behind one boundary with the
				    grid; the fallback keeps the same rows so nothing shifts when it lands. */}
				<Suspense fallback={<ToolbarSkeleton />}>
					<div className={toolbarClass}>
						<nav aria-label="Categories" className={chipRowClass}>
							<CategoryChips categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
						</nav>
						<div className="flex items-center gap-2">
							{filtersAvailable ? <ProductFiltersMobile facets={facets} showCategories={false} /> : null}
							<SortSelect options={sortOptions} />
						</div>
					</div>
					<ProductSection searchParams={searchParams} />
				</Suspense>
			</section>
		</div>
	);
}
