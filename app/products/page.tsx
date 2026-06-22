import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { ProductsPagination } from "./products-pagination";
import { SortLinks, SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price ↑", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price ↓", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "A – Z", orderBy: "name", orderDirection: "asc" },
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

async function getFilterFacets() {
	"use cache";
	cacheLife("minutes");
	return commerce.productFilters();
}

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
	const { page } = await searchParams;
	const pageNum = Math.max(1, Number(page) || 1);
	const canonical = pageNum > 1 ? `/products?page=${pageNum}` : "/products";
	const title = pageNum > 1 ? `The Collection — Page ${pageNum}` : "The Collection";

	return {
		title,
		description: "Browse the complete edit of considered apparel and accessories.",
		alternates: { canonical },
		openGraph: {
			type: "website",
			title,
			description: "Browse the complete edit of considered apparel and accessories.",
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
			<div className="py-24 text-center">
				<p className="text-sm tracking-[0.2em] uppercase text-muted-foreground">No products available yet.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			<ProductsPagination currentPage={currentPage} totalPages={totalPages} filters={filters} />
		</>
	);
}

function ProductGridSkeleton() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={`skeleton-${i}`}>
					<div className="aspect-[3/4] bg-[color:var(--cream)] mb-4 animate-pulse" />
					<div className="space-y-2">
						<div className="h-3 w-1/3 bg-secondary rounded animate-pulse" />
						<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
						<div className="h-4 w-1/4 bg-secondary rounded animate-pulse" />
					</div>
				</div>
			))}
		</div>
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
		<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
			<nav
				aria-label="Breadcrumb"
				className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground"
			>
				<YnsLink href="/" className="hover:text-foreground transition-colors">
					Home
				</YnsLink>
				<span aria-hidden>—</span>
				<span className="text-foreground">All</span>
			</nav>

			<div className="pt-6 pb-6 flex items-end gap-3 sm:gap-4">
				<h1 className="font-display text-5xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-[-0.01em] text-foreground uppercase">
					The Collection
				</h1>
			</div>

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} />}

				<div>
					{/* Mobile/tablet toolbar: Filters button + compact Sort dropdown (sidebar is hidden below lg). */}
					<div className="pb-10 flex items-center justify-between gap-3 lg:hidden">
						{filtersAvailable ? <ProductFiltersMobile facets={facets} /> : <span />}
						<SortSelect options={sortOptions} />
					</div>

					{/* Desktop toolbar: inline sort links (filters live in the sidebar). */}
					<div className="pb-10 hidden flex-wrap items-center gap-3 lg:flex">
						<span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Sort</span>
						<SortLinks options={sortOptions} />
					</div>

					<Suspense fallback={<ProductGridSkeleton />}>
						<ProductSection searchParams={searchParams} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
