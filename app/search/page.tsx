import { Search } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
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

async function SearchResults({ q, page }: { q?: string; page?: string }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;

	if (!q?.trim()) {
		return (
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="text-center">
					<Search className="mx-auto h-12 w-12 text-muted-foreground" />
					<h1 className="mt-4 text-2xl font-medium text-foreground">Search our store</h1>
					<p className="mt-2 text-muted-foreground">Enter a search term to find products.</p>
				</div>
			</section>
		);
	}

	const result = await commerce.productBrowse({
		query: q.trim(),
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset,
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="text-center">
					<Search className="mx-auto h-12 w-12 text-muted-foreground" />
					<h1 className="mt-4 text-2xl font-medium text-foreground">No results found</h1>
					<p className="mt-2 text-muted-foreground">
						No products matched &ldquo;{q}&rdquo;. Try a different search term.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="mb-12">
				<h1 className="text-2xl sm:text-3xl font-medium text-foreground">Results for &ldquo;{q}&rdquo;</h1>
				<p className="mt-2 text-muted-foreground">
					{result.meta.count} {result.meta.count === 1 ? "product" : "products"} found
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			<SearchPagination currentPage={currentPage} totalPages={totalPages} query={q} />
		</section>
	);
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; page?: string }>;
}) {
	const { q, page } = await searchParams;
	return <SearchResults q={q} page={page} />;
}
