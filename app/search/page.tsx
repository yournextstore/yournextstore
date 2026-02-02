import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";
import { SearchPagination } from "./search-pagination";

const PRODUCTS_PER_PAGE = 12;

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
	const { q } = await searchParams;
	return {
		title: q ? `Search: ${q} — Your Next Store` : "Search — Your Next Store",
		description: q ? `Search results for "${q}"` : "Search our store",
	};
}

async function searchProducts(query: string, page: number) {
	"use cache";
	cacheLife("seconds");

	const offset = (page - 1) * PRODUCTS_PER_PAGE;
	return commerce.productBrowse({
		query,
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset,
	});
}

async function SearchResults({ query, page }: { query: string; page?: string }) {
	const currentPage = Math.max(1, Number(page) || 1);
	const results = await searchProducts(query, currentPage);
	const totalPages = Math.ceil(results.meta.count / PRODUCTS_PER_PAGE);

	if (results.data.length === 0) {
		return (
			<div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-16">
				<div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft text-center">
					<h1 className="text-2xl md:text-3xl font-bold mb-4">No results found</h1>
					<p className="text-muted-foreground">
						No products found for &quot;{query}&quot;. Try a different search term.
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<ProductGrid
				title={`Search results for "${query}"`}
				description={`${results.meta.count} product${results.meta.count === 1 ? "" : "s"} found`}
				products={results.data}
				showViewAll={false}
			/>
			<SearchPagination currentPage={currentPage} totalPages={totalPages} query={query} />
		</>
	);
}

function SearchResultsSkeleton() {
	return (
		<section className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
			<div className="flex items-end justify-between mb-8">
				<div>
					<div className="h-8 w-64 bg-secondary rounded-2xl animate-pulse" />
					<div className="mt-2 h-5 w-32 bg-secondary rounded-xl animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="bg-card rounded-3xl p-4 shadow-soft">
						<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded-xl animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded-xl animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; page?: string }>;
}) {
	const { q, page } = await searchParams;

	if (!q || q.trim() === "") {
		return (
			<div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-16">
				<div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft text-center">
					<h1 className="text-2xl md:text-3xl font-bold mb-4">Search Products</h1>
					<p className="text-muted-foreground">Enter a search term to find products.</p>
				</div>
			</div>
		);
	}

	return (
		<main>
			<Suspense fallback={<SearchResultsSkeleton />}>
				<SearchResults query={q} page={page} />
			</Suspense>
		</main>
	);
}
