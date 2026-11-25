import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { SearchPageInput } from "@/components/search/search-page-input";
import { tagKinds } from "@/lib/cache-tags";
import { commerce } from "@/lib/commerce";
import { buildSearchResultsJsonLd, JsonLdScript } from "@/lib/json-ld";
import { ActiveFilters, FilterSidebar, MobileControls, SortSelect } from "./search-controls";
import { type SearchFilters, searchFiltersFrom, toBrowseFilters } from "./search-filters";
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
	tagKinds("category");
	cacheLife("hours");
	const { data } = await commerce.categoriesBrowse({ active: true, limit: 50 });
	return data.filter((c) => !c.parentId).map((c) => ({ id: c.id, slug: c.slug, name: c.name }));
}

// Every filter of the search with how many results each value would leave (YNS-6090). Counts are disjunctive: with a
// value picked, the others in its group still say what switching would show. Null rather than failing the page when
// the filters cannot be read.
async function getSearchFacets({ q, filters }: { q: string; filters: SearchFilters }) {
	"use cache";
	tagKinds("product", "category", "brand");
	cacheLife("minutes");
	return commerce.productFilters({ query: q, ...toBrowseFilters(filters) }).catch(() => null);
}

type SearchResult = Awaited<ReturnType<typeof searchProducts>>;

/** The product a SKU or EAN search names, with its variant picked the way the product page reads it. */
function productHref(match: { slug: string; id: string; variantId: string }, data: SearchResult["data"]) {
	const variant = data.find((p) => p.id === match.id)?.variants.find((v) => v.id === match.variantId);
	const options = new URLSearchParams(
		(variant?.combinations ?? []).map((c) => [c.variantValue.variantType.label, c.variantValue.value]),
	).toString();
	return `/product/${match.slug}${options ? `#${options}` : ""}`;
}

// One browse serves both the header count and the results grid: the second call with the
// same arguments is a cache hit, not another API request.
async function searchProducts({
	q,
	page,
	sort,
	filters,
}: {
	q: string;
	page?: string;
	sort: ReturnType<typeof getSortFromParams>;
	filters: SearchFilters;
}) {
	"use cache";
	tagKinds("product");
	cacheLife("minutes");
	const currentPage = Math.max(1, Number(page) || 1);
	return commerce.productBrowse({
		query: q.trim(),
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
		...sortToBrowseParams(sort),
		...toBrowseFilters(filters),
	});
}

async function SearchResults({
	q,
	page,
	sort,
	filters,
}: {
	q: string;
	page?: string;
	sort: ReturnType<typeof getSortFromParams>;
	filters: SearchFilters;
}) {
	"use cache";
	tagKinds("product");
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(page) || 1);
	const result = await searchProducts({ q, page, sort, filters });

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	const searchJsonLd = <JsonLdScript data={buildSearchResultsJsonLd(q, result.data)} />;
	// The same search for the platform kit's search analytics: the list, then each card's product and place in it.
	const listMarks = {
		"data-yns-list": "search",
		"data-yns-query": q,
		"data-yns-results": result.meta.count,
		"data-yns-page": currentPage,
		"data-yns-sort": sort,
		...(Object.keys(filters).length
			? {
					"data-yns-filters": JSON.stringify(
						Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, value.split(",")])),
					),
				}
			: {}),
	};

	if (result.data.length === 0) {
		return (
			<div {...listMarks}>
				{searchJsonLd}
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

	// Products found by meaning rather than by the query's words follow the others, under their own
	// heading, on stores with search by meaning on.
	const found = result.data.filter((product) => !product.related);
	const related = result.data.filter((product) => product.related);
	const grid = (products: typeof result.data, offset: number) => (
		<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-8">
			{products.map((product, index) => (
				<ProductCard
					key={product.id}
					product={product}
					priority={offset + index === 0}
					listPosition={(currentPage - 1) * PRODUCTS_PER_PAGE + offset + index + 1}
				/>
			))}
		</div>
	);

	return (
		<div {...listMarks}>
			{searchJsonLd}
			{found.length > 0 ? grid(found, 0) : null}
			{related.length > 0 ? (
				<section className={found.length > 0 ? "mt-16 border-t border-border pt-10 sm:mt-20" : undefined}>
					<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						{found.length > 0 ? "Related products" : <>Nothing matched &ldquo;{q}&rdquo; exactly</>}
					</p>
					{found.length > 0 ? null : (
						<h2 className="mt-3 max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
							Related products
						</h2>
					)}
					<div className="mt-8">{grid(related, found.length)}</div>
				</section>
			) : null}
			<SearchPagination
				currentPage={currentPage}
				totalPages={totalPages}
				query={q}
				sort={sort}
				filters={filters}
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

// Results depend on the query, so the page renders in full per request: a navigation keeps the current view until
// the results are ready, with no skeleton.
export const instant = false;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function SearchPage(props: { searchParams: SearchParams }) {
	return <SearchContent searchParams={props.searchParams} />;
}

const SearchContent = async ({ searchParams }: { searchParams: SearchParams }) => {
	const params = await searchParams;
	const single = (key: string) => (typeof params[key] === "string" ? params[key] : undefined);
	const query = single("q")?.trim() ?? "";
	const page = single("page");
	const sort = getSortFromParams(single("sort"));
	const filters = searchFiltersFrom(params);
	const [categories, result, facets] = await Promise.all([
		getActiveCategories(),
		query ? searchProducts({ q: query, page, sort, filters }) : Promise.resolve(null),
		query ? getSearchFacets({ q: query, filters }) : Promise.resolve(null),
	]);
	const totalCount = result?.meta.count ?? 0;
	// What the query names exactly (YNS-6089): a SKU or EAN opens its product; a brand or category gets a link.
	const match = result?.meta.match ?? null;
	if (match?.type === "product" && !page && Object.keys(filters).length === 0) {
		redirect(productHref(match, result?.data ?? []));
	}
	const matchHref =
		match?.type === "brand"
			? `/products?brand=${encodeURIComponent(match.slug)}`
			: match?.type === "category"
				? `/category/${match.slug}`
				: null;
	const correctedQuery = result?.meta.correctedQuery ?? null;

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
								{correctedQuery ? (
									<p className="mt-4 text-sm text-muted-foreground">
										Showing results for <span className="text-foreground">{correctedQuery}</span>
									</p>
								) : null}
								{match && matchHref && match.type !== "product" ? (
									<Link
										href={matchHref}
										className="mt-4 inline-flex border-b border-foreground/30 pb-0.5 text-sm text-foreground transition-colors hover:border-foreground"
									>
										Go to {match.name} →
									</Link>
								) : null}
								<div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
									<span className="text-xs uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
										{totalCount} {totalCount === 1 ? "piece" : "pieces"}
									</span>
									<ActiveFilters categories={categories} facets={facets} filters={filters} />
								</div>
							</div>
							<div className="hidden sm:block">
								<SortSelect value={sort} />
							</div>
						</div>
					</header>

					<MobileControls
						categories={categories}
						facets={facets}
						filters={filters}
						sort={sort}
						totalCount={totalCount}
					/>

					<div className="grid gap-x-10 gap-y-12 pt-8 sm:grid-cols-[180px_1fr] sm:gap-x-12 sm:pt-0 lg:grid-cols-[200px_1fr] lg:gap-x-16">
						<aside className="hidden sm:block">
							<div className="sticky top-24">
								<FilterSidebar
									categories={categories}
									facets={facets}
									filters={filters}
									totalCount={totalCount}
								/>
							</div>
						</aside>
						<SearchResults q={query} page={page} sort={sort} filters={filters} />
					</div>
				</>
			) : (
				<EmptyQuery categories={categories} />
			)}
		</section>
	);
};
