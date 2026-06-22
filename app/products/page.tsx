import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { FilterSidebar, SORT_OPTIONS, type SortValue } from "@/components/sections/filter-sidebar";
import { commerce } from "@/lib/commerce";
import { ProductsPagination } from "./products-pagination";

const PRODUCTS_PER_PAGE = 12;

export const metadata: Metadata = {
	title: "All Products — Your Next Store",
	description: "Browse our complete product collection.",
};

type ProductsPageSearchParams = {
	page?: string;
	sort?: string;
	category?: string;
};

async function ProductList({ page, sort, category }: ProductsPageSearchParams) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = SORT_OPTIONS.find((s) => s.value === (sort as SortValue)) ?? SORT_OPTIONS[0];

	const result = await commerce.productBrowse({
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
		...(category ? { category } : {}),
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<div className="neo-border bg-[var(--color-surface-container-lowest)] py-24 text-center">
				<p className="font-serif text-2xl mb-2">Nothing here yet</p>
				<p className="text-[var(--color-on-surface-variant)]">
					No products matched these filters. Try a different combination.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			<ProductsPagination
				currentPage={currentPage}
				totalPages={totalPages}
				basePath="/products"
				extraParams={{ category }}
				sort={sort}
			/>
		</>
	);
}

function ProductGridSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={`s-${i}`} className="neo-border bg-[var(--color-surface-container-lowest)]">
					<div className="aspect-square bg-[var(--color-surface-variant)] border-b border-foreground animate-pulse" />
					<div className="p-4 space-y-3">
						<div className="h-5 w-3/4 bg-[var(--color-surface-variant)] animate-pulse" />
						<div className="h-4 w-1/3 bg-[var(--color-surface-variant)] animate-pulse" />
					</div>
				</div>
			))}
		</div>
	);
}

export default async function ProductsPage({
	searchParams,
}: {
	searchParams: Promise<ProductsPageSearchParams>;
}) {
	const { page, sort, category } = await searchParams;
	const totalCount = (
		await commerce.productBrowse({
			active: true,
			limit: 1,
			...(category ? { category } : {}),
		})
	).meta.count;

	return (
		<>
			{/* Page header band */}
			<section className="bg-[var(--color-primary-container)] border-b border-foreground">
				<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-12 md:py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
					<div>
						<span className="label-caps text-[var(--color-on-primary-container)]">Shop</span>
						<h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] leading-[1.05] mt-3 text-[var(--color-on-primary-container)]">
							All Products
						</h1>
					</div>
					<div className="label-caps neo-border px-3 py-2 bg-[var(--color-surface-container-lowest)]">
						{totalCount} {totalCount === 1 ? "product" : "products"}
					</div>
				</div>
			</section>

			{/* Filters + grid */}
			<section className="px-5 md:px-20 py-12 md:py-16 border-b border-foreground">
				<div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-8">
					<FilterSidebar basePath="/products" currentSort={sort} currentCategory={category} keepParams={{}} />
					<div className="flex-1 min-w-0">
						<Suspense fallback={<ProductGridSkeleton />}>
							<ProductList page={page} sort={sort} category={category} />
						</Suspense>
					</div>
				</div>
			</section>
		</>
	);
}
