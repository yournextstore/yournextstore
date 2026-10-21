import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { SearchPageInput } from "@/components/search/search-page-input";
import { commerce } from "@/lib/commerce";
import { ActiveFilters, CategorySidebar, MobileControls, SortSelect } from "./search-controls";
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
		<div className="photon-grid px-0!">
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<div key={i} className="flex flex-col gap-3">
					<div className="aspect-square w-full animate-pulse bg-secondary motion-reduce:animate-none" />
					<div className="h-3 w-2/3 animate-pulse bg-secondary motion-reduce:animate-none" />
					<div className="h-3 w-1/3 animate-pulse bg-secondary/60 motion-reduce:animate-none" />
				</div>
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
				<p className="text-muted-foreground">No results</p>
				<h2 className="mt-3 max-w-2xl text-photon-title">Nothing matched &ldquo;{q}&rdquo;</h2>
				<p className="mt-6 max-w-md text-muted-foreground">
					Try a shorter spelling, a broader term, or remove a filter.
				</p>
			</div>
		);
	}

	return (
		<div>
			<div className="photon-grid px-0!">
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
		<div className="border-t border-border pt-6">
			<p className="text-muted-foreground">Search</p>
			<h2 className="mt-3 max-w-3xl text-photon-title">What are you looking for?</h2>
			{categories.length ? (
				<div className="mt-6">
					<p className="text-muted-foreground">Or browse</p>
					<ul className="mt-2 flex flex-wrap gap-x-[var(--main-gap)] gap-y-1">
						{categories.slice(0, 8).map((c) => (
							<li key={c.id}>
								{/* A category alone shows nothing here (results need a query): browse its page. */}
								<Link
									href={`/category/${c.slug}`}
									className="border-b border-foreground/30 pb-0.5 text-foreground transition-colors hover:border-foreground"
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
		<section className="px-[var(--main-gap)] pb-12">
			<div className="pt-4 pb-2">
				<div className="mx-auto max-w-3xl">
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
		<section className="px-[var(--main-gap)] pb-12">
			<div className="pt-4 pb-2">
				<div className="mx-auto max-w-3xl">
					<SearchPageInput initialQuery={query} />
				</div>
			</div>

			{query ? (
				<>
					<header className="pt-4 pb-4">
						<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<p className="text-muted-foreground">Results for</p>
								<h1 className="mt-3 max-w-[14ch] text-photon-title">{query}</h1>
								<div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
									<span className="tabular-nums text-muted-foreground">
										{totalCount} {totalCount === 1 ? "piece" : "pieces"}
									</span>
									<ActiveFilters categories={categories} activeCategory={category} />
								</div>
							</div>
							<div className="hidden sm:block">
								<SortSelect value={sort} />
							</div>
						</div>
					</header>

					<MobileControls
						categories={categories}
						activeCategory={category}
						sort={sort}
						totalCount={totalCount}
					/>

					<div className="grid gap-x-10 gap-y-12 pt-8 sm:grid-cols-[180px_1fr] sm:gap-x-12 sm:pt-0 lg:grid-cols-[200px_1fr] lg:gap-x-16">
						<aside className="hidden sm:block">
							<div className="sticky top-24">
								<CategorySidebar categories={categories} activeCategory={category} totalCount={totalCount} />
							</div>
						</aside>
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
