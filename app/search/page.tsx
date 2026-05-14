import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { SearchPageInput } from "@/app/search-input";
import { ProductCard } from "@/components/product-card";
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

async function getTotalCount({ q, category }: { q: string; category?: string }) {
	"use cache";
	cacheLife("minutes");
	const { meta } = await commerce.productBrowse({
		query: q.trim(),
		active: true,
		limit: 1,
		...(category ? { category } : {}),
	});
	return meta.count;
}

function SearchResultsSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-8">
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
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortParams = sortToBrowseParams(sort);

	const result = await commerce.productBrowse({
		query: q.trim(),
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset,
		...sortParams,
		...(category ? { category } : {}),
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<div>
				<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">No results</p>
				<h2 className="mt-3 max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
					Nothing matched &ldquo;{q}&rdquo;
				</h2>
				<p className="mt-6 max-w-md text-sm text-muted-foreground">
					Try a shorter spelling, a broader term, or remove a filter.
				</p>
			</div>
		);
	}

	return (
		<div>
			<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-8">
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
		<div className="border-t border-border pt-12 sm:pt-20">
			<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Search</p>
			<h2 className="mt-3 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl">
				What are you looking for?
			</h2>
			{categories.length ? (
				<div className="mt-12">
					<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Or browse</p>
					<ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-lg">
						{categories.slice(0, 8).map((c) => (
							<li key={c.id}>
								<a
									href={`/search?category=${encodeURIComponent(c.slug)}`}
									className="border-b border-foreground/30 pb-0.5 text-foreground transition-colors hover:border-foreground"
								>
									{c.name}
								</a>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; page?: string; sort?: string; category?: string }>;
}) {
	const { q, page, sort: sortParam, category } = await searchParams;
	const query = q?.trim() ?? "";
	const sort = getSortFromParams(sortParam);
	const [categories, totalCount] = await Promise.all([
		getActiveCategories(),
		query ? getTotalCount({ q: query, category }) : Promise.resolve(0),
	]);

	return (
		<section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
			<div className="pt-8 pb-4 sm:pt-12 sm:pb-6">
				<div className="mx-auto max-w-3xl">
					<SearchPageInput initialQuery={query} />
				</div>
			</div>

			{query ? (
				<>
					<header className="pt-10 pb-8 sm:pt-14 sm:pb-12">
						<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Results for</p>
								<h1 className="mt-3 max-w-[14ch] text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
									{query}
								</h1>
								<div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
									<span className="text-xs uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
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
}
