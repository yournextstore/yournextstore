import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { TextLink, tileGridClass } from "@/components/deckle";
import { type ChipGroup, FilterChips } from "@/components/filter-chips";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { richTextToPlain } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";

const PRODUCTS_PER_PAGE = 12;

// Filters that apply on top of the path-locked category.
type CategoryFilterParams = {
	page?: string;
	collection?: string;
	brand?: string;
	priceMin?: string;
	priceMax?: string;
	vts?: string;
};

// The SDK loads the parent chain up to 2 levels deep (self -> parent -> grandparent),
// so the canonical path is capped at 3 segments (e.g. fashion/tops/t-shirts).
type CategoryLike = { name: string; slug: string; parent?: CategoryLike | null };

const flattenParents = (category: CategoryLike): Array<{ name: string; slug: string }> => {
	const parent = category.parent;
	return [...(parent ? flattenParents(parent) : []), { name: category.name, slug: category.slug }];
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slugs: string[] }>;
}): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slugs } = await params;
	const slug = slugs.at(-1);
	if (!slug) {
		return { title: "Category Not Found", robots: { index: false, follow: true } };
	}

	const category = await getCategoryData(slug);
	if (!category?.active) {
		return { title: "Category Not Found", robots: { index: false, follow: true } };
	}

	const canonicalPath = flattenParents(category as CategoryLike)
		.map((c) => c.slug)
		.join("/");
	const canonical = category.seo?.canonical || `/category/${canonicalPath}`;
	const title = category.seo?.title || category.name;
	const description = category.seo?.description || `Shop the ${category.name} category.`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title,
			description,
			url: canonical,
			images: category.image ? [{ url: category.image, alt: category.name }] : undefined,
		},
		twitter: {
			card: category.image ? "summary_large_image" : "summary",
			title,
			description,
			images: category.image ? [category.image] : undefined,
		},
	};
}

async function CategoryProducts({
	slug,
	canonicalPath,
	filters,
}: {
	slug: string;
	canonicalPath: string;
	filters: CategoryFilterParams;
}) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;

	const result = await commerce.productBrowse({
		active: true,
		category: slug,
		limit: PRODUCTS_PER_PAGE,
		offset,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);
	const count = result.meta.count;
	const filtered = ["collection", "brand", "priceMin", "priceMax", "vts"].some(
		(key) => filters[key as keyof CategoryFilterParams],
	);

	return (
		<>
			<p
				aria-live="polite"
				className="mt-12 mb-6 flex min-h-[3.1rem] flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-border pt-6"
			>
				<strong className="font-semibold">
					{count === 1 ? "1 product" : `${count} products`}, newest first
				</strong>
				{filtered && <TextLink href={`/category/${canonicalPath}`}>Clear the filters</TextLink>}
			</p>
			{result.data.length === 0 ? (
				<p className="py-16 text-lg text-muted-foreground">Nothing matches these filters.</p>
			) : (
				<ul className={tileGridClass}>
					{result.data.map((product, index) => (
						<li key={product.id}>
							<ProductCard product={product} priority={index < 2} />
						</li>
					))}
				</ul>
			)}
			<ListingPagination
				basePath={`/category/${canonicalPath}`}
				currentPage={currentPage}
				totalPages={totalPages}
				filters={filters}
			/>
		</>
	);
}

function CategoryPageSkeleton() {
	// As tall as a screen: the footer must not paint in the viewport and then jump.
	return (
		<section className="band min-h-svh !pt-6">
			<div className="h-5 w-48 animate-pulse rounded bg-secondary" />
			<div className="mt-10 grid gap-6">
				<div className="h-11 w-72 animate-pulse rounded bg-secondary" />
				<div className="h-6 w-96 max-w-full animate-pulse rounded bg-secondary" />
			</div>
			<p className="mt-12 mb-6 min-h-[3.1rem] border-t border-border pt-6" />
			<ProductGridSkeleton />
		</section>
	);
}

// Awaiting params/searchParams at the top of the page blocks the static shell —
// the page stays a sync shell and the dynamic content streams inside Suspense.
export default function CategoryPage(props: {
	params: Promise<{ slugs: string[] }>;
	searchParams: Promise<CategoryFilterParams>;
}) {
	return (
		<Suspense fallback={<CategoryPageSkeleton />}>
			<CategoryContent params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

// The SDK throws on a 404 despite its `| null` type. Without the null, the `!category`
// branches never run and an unknown slug answers 200 with the error page.
const getCategoryData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, category] = await try_(commerce.categoryGet({ idOrSlug: slug }));
	return error ? null : category;
};

const CategoryContent = async ({
	params,
	searchParams,
}: {
	params: Promise<{ slugs: string[] }>;
	searchParams: Promise<CategoryFilterParams>;
}) => {
	const { slugs } = await params;
	const filters = await searchParams;
	const slug = slugs.at(-1);
	if (!slug) {
		notFound();
	}

	// Both reads are cached and independent — fetch them in parallel.
	const [category, facets] = await Promise.all([getCategoryData(slug), getFilterFacets()]);
	if (!category?.active) {
		notFound();
	}
	// Category facet is hidden here (it's the page context), so don't count it.
	const _filtersAvailable =
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	const hierarchy = flattenParents(category as CategoryLike);
	const canonicalPath = hierarchy.map((c) => c.slug).join("/");
	const currentPath = slugs.join("/");
	if (currentPath !== canonicalPath) {
		permanentRedirect(`/category/${canonicalPath}`);
	}

	const description = richTextToPlain(category.description);
	const generic = description.toLowerCase() === `${category.name} products`.toLowerCase();
	const groups: ChipGroup[] = [
		...(facets.brands.length > 0
			? [
					{
						label: "Brand",
						param: "brand",
						all: "All",
						options: facets.brands.map((b) => ({ label: b.name, value: b.slug })),
					},
				]
			: []),
		...facets.variantTypes.map((vt) => ({
			label: vt.label,
			param: `vts:${vt.label}`,
			all: "Any",
			options: vt.values.map((value) => ({ label: value, value })),
		})),
	];

	return (
		<section aria-labelledby="category-title" className="band !pt-6">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<nav aria-label="Breadcrumb">
				<ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-muted-foreground">
					<li>
						<Link href="/products" className="hover:text-foreground">
							Products
						</Link>
					</li>
					{hierarchy.map((crumb, index) => {
						const path = hierarchy
							.slice(0, index + 1)
							.map((c) => c.slug)
							.join("/");
						const isLast = index === hierarchy.length - 1;
						return (
							<li key={crumb.slug} className="inline-flex items-center gap-2">
								<ChevronRight aria-hidden="true" className="size-3" />
								{isLast ? (
									<span aria-current="page">{crumb.name}</span>
								) : (
									<Link href={`/category/${path}`} className="hover:text-foreground">
										{crumb.name}
									</Link>
								)}
							</li>
						);
					})}
				</ol>
			</nav>

			<div className="mt-10 grid justify-items-start gap-6">
				<h1 id="category-title" className="max-w-[20ch] text-title-1 text-balance">
					{category.name}
				</h1>
				<p className="max-w-[52ch] text-lg text-muted-foreground">
					{description && !generic
						? description
						: `Every piece in ${category.name.toLowerCase()}, newest first.`}
				</p>
				{/* The sibling categories as a row of chips, the current one inked. */}
				<nav aria-label="Categories" className="w-full min-w-0">
					<div className="grid min-w-0 gap-2 lg:grid-cols-[6.5rem_minmax(0,1fr)] lg:items-center">
						<span className="text-[0.8125rem] font-semibold text-muted-foreground">Category</span>
						<ul className="relative flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] lg:flex-wrap lg:overflow-x-visible">
							<li className="shrink-0">
								<Link
									href="/products"
									className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full bg-secondary px-3.5 text-sm font-semibold hover:shadow-[inset_0_0_0_1px_var(--input)]"
								>
									All
								</Link>
							</li>
							{facets.categories.map((c) => (
								<li key={c.slug} className="shrink-0">
									<Link
										href={`/category/${c.slug}`}
										aria-current={c.slug === slug ? "page" : undefined}
										className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full bg-secondary px-3.5 text-sm font-semibold hover:shadow-[inset_0_0_0_1px_var(--input)] aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
									>
										{c.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</nav>
				{groups.length > 0 && <FilterChips groups={groups} label="Filter the products" />}
			</div>

			<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
		</section>
	);
};
