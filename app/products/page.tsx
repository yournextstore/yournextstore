import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingSkeleton, ListingToolbar, sortOptions } from "@/components/listing-toolbar";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/sections/product-filters";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { cn } from "@/lib/utils";

const PRODUCTS_PER_PAGE = 12;

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

async function ProductList({
	filters,
	facets,
	filtersAvailable,
}: {
	filters: ProductFilterParams;
	facets: Awaited<ReturnType<typeof getFilterFacets>>;
	filtersAvailable: boolean;
}) {
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
			<ListingToolbar
				trail={[{ href: "/", label: "Home" }, { label: "All Products" }]}
				count={result.meta.count}
				facets={facets}
				showFilters={filtersAvailable}
			/>
			<div
				className={filtersAvailable ? "pt-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10" : "pt-6"}
			>
				{filtersAvailable && <ProductFilters facets={facets} />}
				<div>
					{result.data.length === 0 ? (
						<div className="py-24 text-center">
							<p className="text-body text-muted-foreground">No products match these filters.</p>
						</div>
					) : (
						<div
							className={cn(
								"grid grid-cols-1 gap-x-3 gap-y-10 sm:grid-cols-2",
								filtersAvailable ? "xl:grid-cols-3" : "lg:grid-cols-3",
							)}
						>
							{result.data.map((product, index) => (
								<ProductCard
									key={product.id}
									product={product}
									priority={index < 2}
									sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
								/>
							))}
						</div>
					)}

					<ListingPagination
						basePath="/products"
						currentPage={currentPage}
						totalPages={totalPages}
						filters={filters}
					/>
				</div>
			</div>
		</>
	);
}

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; `ProductList` remains cached, keyed on the resolved filters.
async function ProductSection({
	searchParams,
	facets,
	filtersAvailable,
}: {
	searchParams: Promise<ProductFilterParams>;
	facets: Awaited<ReturnType<typeof getFilterFacets>>;
	filtersAvailable: boolean;
}) {
	const filters = await searchParams;
	return <ProductList filters={filters} facets={facets} filtersAvailable={filtersAvailable} />;
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
		<div className="page-x pt-10 pb-16 lg:pt-14 lg:pb-24">
			<div className="mb-10 text-center lg:mb-12">
				<h1 className="text-heading-xl">All Products</h1>
				<p className="mt-4 text-body-sm">Explore our full catalog of products.</p>
			</div>

			{/* The toolbar, filters and sort read useSearchParams(), so they stream in behind one
			    boundary with the grid while the chrome and the heading above prerender. */}
			<Suspense fallback={<ListingSkeleton withSidebar={filtersAvailable} />}>
				<ProductSection searchParams={searchParams} facets={facets} filtersAvailable={filtersAvailable} />
			</Suspense>
		</div>
	);
}
