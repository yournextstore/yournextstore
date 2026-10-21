import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ListingResults, ListingResultsSkeleton, ListingShell } from "@/components/bento/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { commerce } from "@/lib/commerce";
import { getListingSort, sortBrowseParams } from "@/lib/listing";

const PRODUCTS_PER_PAGE = 24;

type SearchParams = { q?: string; page?: string; sort?: string };

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
	const { q } = await searchParams;
	return {
		title: q ? `Search: ${q}` : "Search",
		description: q ? `Search results for "${q}"` : "Search for products in the store.",
		alternates: { canonical: "/search" },
		robots: { index: false, follow: true },
	};
}

async function SearchResults({ q, page, sortSlug }: { q: string; page?: string; sortSlug?: string }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(page) || 1);
	const sort = getListingSort(sortSlug);
	const result = await commerce.productBrowse({
		...(q ? { query: q } : {}),
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
		...sortBrowseParams(sort),
	});
	const count = result.meta.count;

	return (
		<ListingResults
			products={result.data}
			basePath="/search"
			sort={sort}
			q={q || undefined}
			empty={null}
			before={
				q ? (
					<p className="mb-4">
						{count === 0
							? "There are no products that match "
							: `Showing ${count} ${count === 1 ? "result" : "results"} for `}
						<span className="font-bold">&quot;{q}&quot;</span>
					</p>
				) : null
			}
			after={
				<ListingPagination
					basePath="/search"
					currentPage={currentPage}
					totalPages={Math.ceil(count / PRODUCTS_PER_PAGE)}
					filters={{ q: q || undefined, sort: sortSlug }}
				/>
			}
		/>
	);
}

async function SearchSection({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const { q, page, sort } = await searchParams;
	return <SearchResults q={q?.trim() ?? ""} page={page} sortSlug={sort} />;
}

export default function SearchPage(props: { searchParams: Promise<SearchParams> }) {
	return (
		<ListingShell title="Search" activePath="/search">
			<Suspense fallback={<ListingResultsSkeleton />}>
				<SearchSection searchParams={props.searchParams} />
			</Suspense>
		</ListingShell>
	);
}
