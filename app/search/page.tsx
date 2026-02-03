import { Search } from "lucide-react";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductCardLarge } from "@/components/sections/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce } from "@/lib/commerce";
import { SearchForm } from "./search-form";

type SearchPageProps = {
	searchParams: Promise<{ q?: string }>;
};

function SearchResultsSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i}>
					<Skeleton className="aspect-[4/5] mb-6" />
					<div className="flex justify-between">
						<div>
							<Skeleton className="h-8 w-40 mb-2" />
							<Skeleton className="h-4 w-24" />
						</div>
						<Skeleton className="h-6 w-16" />
					</div>
				</div>
			))}
		</div>
	);
}

async function SearchResults({ query }: { query: string }) {
	"use cache";
	cacheLife("seconds");

	const results = await commerce.productBrowse({
		query,
		active: true,
		limit: 12,
	});

	if (results.data.length === 0) {
		return (
			<div className="text-center py-16">
				<Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
				<h2 className="font-display text-2xl mb-2">No products found</h2>
				<p className="text-muted-foreground">Try searching for something else or browse our collections.</p>
			</div>
		);
	}

	return (
		<>
			<p className="text-muted-foreground mb-8">
				Found {results.data.length} product{results.data.length !== 1 ? "s" : ""} for &ldquo;{query}
				&rdquo;
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{results.data.map((product) => (
					<ProductCardLarge key={product.id} product={product} />
				))}
			</div>
		</>
	);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const { q } = await searchParams;
	const query = q?.trim() ?? "";

	return (
		<div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
			<div className="mb-12">
				<h1 className="font-display text-4xl md:text-5xl mb-6">Search Products</h1>
				<SearchForm initialQuery={query} />
			</div>

			{query ? (
				<Suspense fallback={<SearchResultsSkeleton />}>
					<SearchResults query={query} />
				</Suspense>
			) : (
				<div className="text-center py-16">
					<Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
					<h2 className="font-display text-2xl mb-2">Search for products</h2>
					<p className="text-muted-foreground">Enter a search term to find products.</p>
				</div>
			)}
		</div>
	);
}
