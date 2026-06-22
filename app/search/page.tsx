import type { Metadata } from "next";
import { cacheLife } from "next/cache";
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
	cacheLife("minutes");

	const offset = (page - 1) * PRODUCTS_PER_PAGE;
	return commerce.productBrowse({
		query: query.trim(),
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

// Results depend on the query, so the page renders in full per request: a navigation keeps the current view until
// the results are ready, with no skeleton.
export const instant = false;

export default function SearchPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
	return <SearchContent searchParams={props.searchParams} />;
}

const SearchContent = async ({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) => {
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
			<SearchResults query={q} page={page} />
		</main>
	);
};
