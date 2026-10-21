import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import {
	CatalogueGrid,
	CatalogueGridSkeleton,
	CatalogueHeader,
	type ChipGroup,
	FilterBar,
	hrefWith,
} from "@/components/catalogue";
import { ListingPagination } from "@/components/listing-pagination";
import { getCatalogProducts, getCategories, getCollections } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";

const PRODUCTS_PER_PAGE = 18;

const sortOptions = [
	{ value: "featured", label: "Featured", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price — low to high", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price — high to low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name — A to Z", orderBy: "name", orderDirection: "asc" },
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
	const title = pageNum > 1 ? `The Catalogue — Page ${pageNum}` : "The Catalogue";
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Browse every piece in the ${storeName} catalogue. ${storeDescription}`
		: `Browse every piece in the ${storeName} catalogue. Filter by category and collection.`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: { type: "website", title, description, url: canonical },
	};
}

/** Category and collection chips; "All" clears its own key and keeps the other. */
async function getChipGroups(filters: ProductFilterParams): Promise<ChipGroup[]> {
	const [categories, collections] = await Promise.all([getCategories(), getCollections()]);
	const keep = { sort: filters.sort, category: filters.category, collection: filters.collection };
	return [
		{
			label: "Category",
			chips: [
				{
					label: "All pieces",
					href: hrefWith("/products", keep, { category: undefined }),
					current: !filters.category,
				},
				...categories
					.filter((c) => c.count > 0)
					.map((c) => ({
						label: c.name,
						href: hrefWith("/products", keep, { category: c.slug }),
						current: filters.category === c.slug,
					})),
			],
		},
		{
			label: "Collection",
			chips: [
				{
					label: "All collections",
					href: hrefWith("/products", keep, { collection: undefined }),
					current: !filters.collection,
				},
				...collections.map((c) => ({
					label: c.name,
					href: hrefWith("/products", keep, { collection: c.slug }),
					current: filters.collection === c.slug,
				})),
			],
		},
	];
}

function sortChoices(filters: ProductFilterParams) {
	return sortOptions.map((option) => ({
		value: option.value,
		label: option.label,
		href: hrefWith("/products", filters, { sort: option.value === "featured" ? undefined : option.value }),
	}));
}

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];

	const [result, groups] = await Promise.all([
		commerce.productBrowse({
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
		}),
		getChipGroups(filters),
	]);

	return (
		<>
			<FilterBar
				groups={groups}
				sort={{ choices: sortChoices(filters), current: sortOption.value }}
				count={result.meta.count}
			/>
			<CatalogueGrid products={result.data} />
			<ListingPagination
				basePath="/products"
				currentPage={currentPage}
				totalPages={Math.ceil(result.meta.count / PRODUCTS_PER_PAGE)}
				filters={filters}
			/>
		</>
	);
}

// Awaits `searchParams` (runtime data) inside the Suspense boundary so the heading prerenders.
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

/** The same bar, unfiltered and inert, so the toolbar lands without moving the grid. */
async function ProductListFallback() {
	const [groups, products] = await Promise.all([getChipGroups({}), getCatalogProducts()]);
	return (
		<>
			<FilterBar
				groups={groups}
				sort={{ choices: sortChoices({}), current: "featured" }}
				count={products.length}
				pending
			/>
			<CatalogueGridSkeleton />
		</>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const [products, categories] = await Promise.all([getCatalogProducts(), getCategories()]);
	const rooms = categories.filter((c) => c.count > 0).length;

	return (
		<div className="shell min-h-svh">
			<CatalogueHeader
				title="Every piece, in one place"
				lead={`${products.length} pieces across ${rooms} ${rooms === 1 ? "category" : "categories"}. Filter to find what fits.`}
			/>
			<Suspense fallback={<ProductListFallback />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
