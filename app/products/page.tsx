import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { SectionHead } from "@/components/field/section-head";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { GRID_REFS } from "@/lib/field";
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
	// Under the default order, pictured, priced products lead the page; image-less or zero-priced ones close it.
	const pictured = (p: (typeof result.data)[number]) =>
		(p.images?.length ?? 0) > 0 && p.variants.some((v) => Number(v.price) > 0);
	const products = filters.sort
		? result.data
		: [...result.data.filter(pictured), ...result.data.filter((p) => !pictured(p))];

	if (result.data.length === 0) {
		return (
			<div className="rounded-[2px] border border-line px-6 py-24 text-center">
				<p className="eyebrow mb-3 justify-center">NO SIGNAL</p>
				<p className="text-lg text-dim">Nothing matches these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
				{products.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						priority={index === 0}
						index={offset + index}
						sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 300px"
					/>
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
		<div className="section-x min-h-svh pt-[clamp(48px,8vh,88px)] pb-[clamp(72px,11vh,132px)]">
			<SectionHead
				as="h1"
				gridRef={GRID_REFS[3]}
				eyebrow="FULL INVENTORY"
				title="All products"
				lead="Every item in the range with its spec sheet. Filter by collection or price, sort by what matters on the day."
				className="mb-10"
			/>

			{/* The filter and sort controls read useSearchParams(), so they stream in behind one
			    boundary with the grid while the chrome and the heading above prerender. */}
			<div className="frame">
				<Suspense fallback={<ListingFallback filters={filtersAvailable} />}>
					<div className={filtersAvailable ? "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10" : ""}>
						{filtersAvailable && <ProductFilters facets={facets} />}

						<div>
							{/* Mobile/tablet toolbar: Filters button + compact Sort dropdown (sidebar is hidden below lg). */}
							<div className="mb-8 flex h-8 items-center justify-between gap-3 lg:hidden">
								{filtersAvailable ? <ProductFiltersMobile facets={facets} /> : <span />}
								<SortSelect options={sortOptions} />
							</div>

							{/* Desktop toolbar: inline sort links (filters live in the sidebar). */}
							<div className="font-field mb-8 hidden h-8 flex-wrap items-center gap-x-5 gap-y-2 border-b border-line pb-3 text-[0.74rem] tracking-[0.06em] uppercase lg:flex">
								<span className="text-faint">Sort {/*  */}</span>
								<SortLinks options={sortOptions} />
							</div>

							<ProductSection searchParams={searchParams} />
						</div>
					</div>
				</Suspense>
			</div>
		</div>
	);
}

function ListingFallback({ filters }: { filters: boolean }) {
	return (
		<div className={filters ? "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10" : ""}>
			{filters && <div className="hidden h-96 lg:block" />}
			<div>
				<div className="mb-8 flex h-8 items-center justify-between gap-3 lg:hidden">
					<div className="h-8 w-24 border border-line" />
					<div className="h-8 w-36 border border-line" />
				</div>
				<div className="mb-8 hidden h-8 border-b border-line lg:block" />
				<ProductGridSkeleton count={6} className="sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" />
			</div>
		</div>
	);
}
