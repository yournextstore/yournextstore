import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ChipLinks, ListingSkeleton, ListingToolbar, ResultCount } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { CARD_GRID } from "@/components/product-grid-skeleton";
import { Banner } from "@/components/sections/frntr";
import { EDITORIAL, getCategories, getCollections, picturedFirst } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { sortFor } from "@/lib/sort";

const PRODUCTS_PER_PAGE = 16;

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
	const sortOption = sortFor(filters.sort);

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
			<>
				<ResultCount count={0} />
				<p className="py-24 text-center text-lg text-muted-foreground">No products match these filters.</p>
			</>
		);
	}

	return (
		<>
			<ResultCount count={result.meta.count} />
			<div className={CARD_GRID}>
				{(filters.sort ? result.data : picturedFirst(result.data)).map((product, index) => (
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
	// Everything above the grid is cached and independent of `searchParams`, so it prerenders;
	// the toolbar (useSearchParams) and the list stream in behind one same-height boundary.
	const [facets, categories, collections] = await Promise.all([
		getFilterFacets(),
		getCategories(),
		getCollections(),
	]);
	const banner = collections[0];

	return (
		<div className="frame pt-6 lg:pt-10">
			<div className="max-w-[600px]">
				<h1 className="text-[28px] leading-tight font-semibold sm:text-[32px]">Shop</h1>
				<p className="mt-3 text-base leading-[1.9] text-muted-foreground sm:text-lg">
					Everything in the shop in one place. Filter, sort and find the pieces that fit the way you live.
				</p>
			</div>
			<ChipLinks
				links={[
					...categories.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
					...collections.map((collection) => ({
						href: `/collection/${collection.slug}`,
						label: collection.name,
					})),
				]}
			/>

			{banner && (
				<Banner
					className="mt-16 lg:mt-20"
					image={EDITORIAL.shop}
					title={`${banner.name}: colour your every day`}
					text={banner.description || null}
					href={`/collection/${banner.slug}`}
					cta={`See all ${banner.name.toLowerCase()}`}
				/>
			)}

			<div className="mt-16 lg:mt-24">
				<Suspense fallback={<ListingSkeleton />}>
					<div className="min-h-svh">
						<ListingToolbar facets={facets} />
						<ProductSection searchParams={searchParams} />
					</div>
				</Suspense>
			</div>
		</div>
	);
}
