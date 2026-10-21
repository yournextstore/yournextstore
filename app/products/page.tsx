import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { FiltersSkeleton, ListingFrame, ListingToolbar } from "@/components/listing-frame";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { ShopStrip } from "@/components/shop-strip";
import { photographedFirst } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
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

	return {
		currentPage,
		products: filters.sort ? result.data : photographedFirst(result.data),
		count: result.meta.count,
	};
}

type Facets = Awaited<ReturnType<typeof getFilterFacets>>;

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; the browse itself is cached, keyed on the resolved filters.
async function ProductSection({
	searchParams,
	facets,
	filtersAvailable,
}: {
	searchParams: Promise<ProductFilterParams>;
	facets: Facets;
	filtersAvailable: boolean;
}) {
	const filters = await searchParams;
	const { currentPage, products, count } = await getProductPage(filters);
	const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE);

	return (
		<>
			<ListingToolbar
				count={count}
				filters={filtersAvailable ? <ProductFiltersMobile facets={facets} /> : null}
				sort={<SortSelect options={sortOptions} />}
			/>
			{products.length === 0 ? (
				<div className="py-24 text-center">
					<p className="text-lg text-muted-foreground">No products match these filters.</p>
				</div>
			) : (
				<>
					<div className={LISTING_GRID}>
						{products.map((product, index) => (
							<ProductCard key={product.id} product={product} priority={index < 2} />
						))}
					</div>
					<ListingPagination
						basePath="/products"
						currentPage={currentPage}
						totalPages={totalPages}
						filters={filters}
					/>
				</>
			)}
		</>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// `facets` is cached and independent of `searchParams`, so it can drive the layout
	// shell without making the route blocking.
	const facets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<>
			<ShopStrip current="/products" />
			<h1 className="sr-only">All products</h1>
			<ListingFrame
				sidebar={filtersAvailable ? <ProductFilters facets={facets} /> : null}
				fallbackSidebar={filtersAvailable ? <FiltersSkeleton facets={facets} /> : null}
			>
				<ProductSection searchParams={searchParams} facets={facets} filtersAvailable={filtersAvailable} />
			</ListingFrame>
		</>
	);
}
