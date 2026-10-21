import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import {
	type Chip,
	EmptyListing,
	InsertCard,
	ListingSkeleton,
	PageHead,
	ShopTools,
} from "@/components/garden/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { sortOptionFor } from "@/lib/sort";

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

async function getCatalogueCount() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce.productBrowse({ active: true, limit: 1 }).catch(() => null);
	return result?.meta.count ?? 0;
}

function hrefWith(params: Record<string, string | undefined>) {
	const search = new URLSearchParams(
		Object.entries(params).flatMap(([key, value]) => (value ? [[key, value]] : [])),
	);
	return search.size ? `/products?${search}` : "/products";
}

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	// The unfiltered catalogue drops the grid-paper insert into page 1, so that page takes one
	// product fewer and keeps whole rows; later pages shift by one to match.
	const withInsert =
		!filters.category &&
		!filters.collection &&
		!filters.brand &&
		!filters.vts &&
		!filters.priceMin &&
		!filters.priceMax;
	const offset =
		withInsert && currentPage > 1
			? (currentPage - 1) * PRODUCTS_PER_PAGE - 1
			: (currentPage - 1) * PRODUCTS_PER_PAGE;
	const limit = withInsert && currentPage === 1 ? PRODUCTS_PER_PAGE - 1 : PRODUCTS_PER_PAGE;
	const sortOption = sortOptionFor(filters.sort);

	const [result, facets] = await Promise.all([
		commerce.productBrowse({
			active: true,
			limit,
			offset,
			orderBy: sortOption.orderBy,
			orderDirection: sortOption.orderDirection,
			category: filters.category,
			collection: filters.collection,
			brand: filters.brand,
			priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
			priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
			vts: filters.vts,
		}),
		getFilterFacets(),
	]);

	const chips: Chip[] = [
		{ href: hrefWith({ sort: filters.sort }), label: "Everything", active: !filters.category },
		...facets.categories.map((category) => ({
			href: hrefWith({ category: category.slug, sort: filters.sort }),
			label: category.name,
			active: filters.category === category.slug,
		})),
	];

	const totalPages = Math.ceil((result.meta.count + (withInsert ? 1 : 0)) / PRODUCTS_PER_PAGE);
	const unfiltered = currentPage === 1 && withInsert;
	const cards = result.data.map((product, index) => (
		<ProductCard key={product.id} product={product} priority={index === 0} showNote headingLevel="h2" />
	));

	return (
		<>
			<ShopTools chips={chips} shown={result.data.length} total={result.meta.count} />
			{result.data.length === 0 ? (
				<EmptyListing message="Nothing matches these filters." />
			) : (
				<div className="shop-grid">
					{unfiltered && cards.length > 3 ? (
						<>
							{cards.slice(0, 3)}
							<InsertCard href="/faq" linkLabel="Read the FAQ" />
							{cards.slice(3)}
						</>
					) : (
						cards
					)}
				</div>
			)}
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
	const count = await getCatalogueCount();

	return (
		<div className="min-h-svh pb-[clamp(3rem,6vw,5rem)]">
			<PageHead
				crumbs={[{ href: "/", label: "Home" }, { label: "Shop" }]}
				title="The Collection"
				lede={`${count === 1 ? "One item" : `${count} items`}: trees, pots and tools from our benches. Browse by category, by collection, or simply by whichever tree you keep looking back at.`}
				note={
					<>
						Take your time,
						<br />
						look around.
					</>
				}
			/>
			<div className="wrap">
				<Suspense fallback={<ListingSkeleton />}>
					<ProductSection searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	);
}
