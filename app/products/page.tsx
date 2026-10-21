import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { Crumbs } from "@/components/crumbs";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { photographedFirst } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getShelves } from "@/lib/shop";
import { SortSelect } from "./products-sort-select";

const PRODUCTS_PER_PAGE = 20;

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
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<p className="mb-4 text-sm text-muted-foreground">
				{result.meta.count} {result.meta.count === 1 ? "item" : "items"} on the shelves
			</p>
			<div className="shelf-grid">
				{(filters.sort ? result.data : photographedFirst(result.data)).map((product, index) => (
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
	);
}

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; `ProductList` remains cached, keyed on the resolved filters.
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

function ToolbarFallback() {
	return <div aria-hidden="true" className="h-8 w-[9rem] rounded-md border border-input" />;
}

function ListFallback() {
	return (
		<>
			<div className="mb-4 h-5" />
			<ProductGridSkeleton count={20} />
		</>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const { categories } = await getShelves();

	return (
		<div className="shelf-container min-h-svh py-6">
			<Crumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
			<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
				<h1 className="font-serif text-2xl font-semibold">All Products</h1>
				{/* The sort control reads useSearchParams(), so it streams in behind its own boundary
				    with a fallback of the same box. */}
				<Suspense fallback={<ToolbarFallback />}>
					<SortSelect options={sortOptions} />
				</Suspense>
			</div>
			{categories.length > 0 ? (
				<nav aria-label="Categories" className="mt-3 mb-6">
					<ul className="flex flex-wrap gap-x-4 gap-y-1">
						{categories.map((category) => (
							<li key={category.href}>
								<Link href={category.href} className="link-dashed text-foreground/90 hover:text-foreground">
									{category.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			) : (
				<div className="mb-6" />
			)}
			<Suspense fallback={<ListFallback />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
