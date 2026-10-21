import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingPagination } from "@/components/listing-pagination";
import { MenuChips, MenuGrid, MenuLayout, MenuSearch, MenuSidebar, SectionHeader } from "@/components/menu";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getMenuCategories, picturedFirst } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 24;

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
	const title = pageNum > 1 ? `Shop — Page ${pageNum}` : "Shop";
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Everything at ${storeName}. ${storeDescription}`
		: `Everything at ${storeName}.`;

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
		return <p className="py-16 text-body-md text-muted-foreground">Nothing matches that.</p>;
	}
	// The default order leads with photographed products; an explicit sort is kept as asked.
	const products = sortOption === sortOptions[0] ? picturedFirst(result.data) : result.data;

	return (
		<>
			<MenuGrid>
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 2} headingLevel="h2" />
				))}
			</MenuGrid>

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
	const categories = await getMenuCategories();
	const links = [
		{ href: "/products", label: "All items", current: true },
		...categories.map((category) => ({ href: `/category/${category.path}`, label: category.name })),
	];

	return (
		<MenuLayout leading={<MenuSidebar links={links} />}>
			<SectionHeader
				as="h1"
				title="Shop all"
				description="Everything in the shop right now."
				action={
					<Suspense fallback={<div className="h-8 w-36 rounded-full border border-border bg-secondary" />}>
						<SortSelect options={sortOptions} />
					</Suspense>
				}
			/>
			<MenuSearch />
			<MenuChips links={links} label="Shop categories" />
			<Suspense fallback={<ProductGridSkeleton count={12} className="min-h-svh" />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</MenuLayout>
	);
}
