import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID, ProductCardSkeleton } from "@/components/product-grid-skeleton";
import { SearchPageInput } from "@/components/search/search-page-input";
import { commerce } from "@/lib/commerce";
import { ActiveFilters, MobileControls } from "./search-controls";
import { SearchPagination } from "./search-pagination";
import { getSortFromParams, sortToBrowseParams } from "./sort";

const PRODUCTS_PER_PAGE = 12;

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
	const { q } = await searchParams;
	return {
		title: q ? `Search: ${q}` : "Search",
		description: q ? `Search results for "${q}"` : "Search our store",
		alternates: { canonical: "/search" },
		robots: { index: false, follow: true },
	};
}

async function getActiveCategories() {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.categoriesBrowse({ active: true, limit: 50 });
	return data.filter((c) => !c.parentId).map((c) => ({ id: c.id, slug: c.slug, name: c.name }));
}

// One browse serves both the header count and the results grid: the second call with the
// same arguments is a cache hit, not another API request.
async function searchProducts({
	q,
	page,
	sort,
	category,
}: {
	q: string;
	page?: string;
	sort: ReturnType<typeof getSortFromParams>;
	category?: string;
}) {
	"use cache";
	cacheLife("minutes");
	const currentPage = Math.max(1, Number(page) || 1);
	return commerce.productBrowse({
		query: q.trim(),
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
		...sortToBrowseParams(sort),
		...(category ? { category } : {}),
	});
}

function SearchResultsSkeleton() {
	return (
		<div className={PRODUCT_GRID}>
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<ProductCardSkeleton key={i} />
			))}
		</div>
	);
}

async function SearchResults({
	q,
	page,
	sort,
	category,
}: {
	q: string;
	page?: string;
	sort: ReturnType<typeof getSortFromParams>;
	category?: string;
}) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(page) || 1);
	const result = await searchProducts({ q, page, sort, category });

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<div>
				<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">No results</p>
				<h2 className="mt-2 text-gf-h3 font-bold">Nothing matched &ldquo;{q}&rdquo;</h2>
				<p className="mt-6 max-w-md text-sm text-muted-foreground">
					Try a shorter spelling, a broader term, or remove a filter.
				</p>
			</div>
		);
	}

	return (
		<div>
			<h2 className="sr-only">Results</h2>
			<div className={PRODUCT_GRID}>
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
			<SearchPagination
				currentPage={currentPage}
				totalPages={totalPages}
				query={q}
				sort={sort}
				category={category}
			/>
		</div>
	);
}

function EmptyQuery({ categories }: { categories: { id: string; slug: string; name: string }[] }) {
	return (
		<div className="pt-8">
			<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Search</p>
			<h1 className="mt-2 text-gf-h2 font-bold">What are you looking for?</h1>
			{categories.length ? (
				<div className="mt-12">
					<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Or browse</p>
					<ul className="mt-4 flex flex-wrap gap-2.5">
						{categories.slice(0, 8).map((c) => (
							<li key={c.id}>
								{/* A category alone shows nothing here (results need a query): browse its page. */}
								<Link
									href={`/category/${c.slug}`}
									className="inline-flex min-h-11 items-center rounded-full bg-flash-white px-5 text-gf-h6 font-bold hover:bg-light-silver"
								>
									{c.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}

function SearchPageSkeleton() {
	return (
		<section className="pb-6">
			<div className="pt-[30px] pb-4">
				<div>
					<div className="h-12 w-full animate-pulse bg-secondary motion-reduce:animate-none" />
				</div>
			</div>
			<div className="pt-10">
				<SearchResultsSkeleton />
			</div>
		</section>
	);
}

// Awaiting searchParams at the top of the page blocks the static shell — the
// page stays a sync shell and the query-dependent content streams inside Suspense.
export default function SearchPage(props: {
	searchParams: Promise<{ q?: string; page?: string; sort?: string; category?: string }>;
}) {
	return (
		<Suspense fallback={<SearchPageSkeleton />}>
			<SearchContent searchParams={props.searchParams} />
		</Suspense>
	);
}

const SearchContent = async ({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; page?: string; sort?: string; category?: string }>;
}) => {
	const { q, page, sort: sortParam, category } = await searchParams;
	const query = q?.trim() ?? "";
	const sort = getSortFromParams(sortParam);
	const [categories, totalCount] = await Promise.all([
		getActiveCategories(),
		query
			? searchProducts({ q: query, page, sort, category }).then(({ meta }) => meta.count)
			: Promise.resolve(0),
	]);

	return (
		<section className="pb-6">
			<div className="pt-[30px] pb-4">
				<div>
					<SearchPageInput initialQuery={query} />
				</div>
			</div>

			{query ? (
				<>
					<div className="pt-6 pb-6">
						<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Results for</p>
								<h1 className="mt-2 text-gf-h2 font-bold break-words">{query}</h1>
								<div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
									<span className="text-xs uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
										{totalCount} {totalCount === 1 ? "piece" : "pieces"}
									</span>
									<ActiveFilters categories={categories} activeCategory={category} />
								</div>
							</div>
						</div>
					</div>

					<MobileControls
						categories={categories}
						activeCategory={category}
						sort={sort}
						totalCount={totalCount}
					/>

					<div className="pt-6">
						<Suspense fallback={<SearchResultsSkeleton />}>
							<SearchResults q={query} page={page} sort={sort} category={category} />
						</Suspense>
					</div>
				</>
			) : (
				<EmptyQuery categories={categories} />
			)}
		</section>
	);
};
