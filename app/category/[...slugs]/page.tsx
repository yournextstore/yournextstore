import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import { try_ } from "safe-try";
import { CountLabel, FeatureRow, SideNav, shopEntries } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { getShelf } from "@/lib/catalog";
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
	name,
	canonicalPath,
	filters,
}: {
	slug: string;
	name: string;
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

	return (
		<>
			<div className="mb-6 flex min-h-9 items-center">
				<CountLabel label={name} count={result.meta.count} />
			</div>
			{result.data.length === 0 && (
				<div className="py-24 text-center">
					<p className="text-copy text-plum">No products match these filters.</p>
				</div>
			)}
			<div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8">
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
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
	return (
		<div className="min-h-svh px-6 pb-20 pt-6 lg:px-8">
			<div className="h-5 w-48 animate-pulse rounded bg-sand" />
			<div className="mt-6 border-t border-rule pt-4 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
				<div className="hidden lg:block" />
				<div>
					<div className="mb-6 flex min-h-9 items-center">
						<span className="h-4 w-28 animate-pulse rounded bg-sand" />
					</div>
					<ProductGridSkeleton />
				</div>
			</div>
		</div>
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
	const filtersAvailable =
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

	const shelf = await getShelf();
	const href = `/category/${canonicalPath}`;

	return (
		<div className="min-h-svh px-6 pb-20 pt-6 lg:px-8">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<nav aria-label="Breadcrumb" className="text-copy font-semibold text-ink">
				<Link href="/products" className="transition-opacity hover:opacity-70">
					Categories
				</Link>
				{hierarchy.map((crumb, index) => {
					const path = hierarchy
						.slice(0, index + 1)
						.map((c) => c.slug)
						.join("/");
					const isLast = index === hierarchy.length - 1;
					return (
						<Fragment key={crumb.slug}>
							<span aria-hidden className="mx-1">
								/
							</span>
							{isLast ? (
								<h1 className="inline">{crumb.name}</h1>
							) : (
								<Link href={`/category/${path}`} className="transition-opacity hover:opacity-70">
									{crumb.name}
								</Link>
							)}
						</Fragment>
					);
				})}
			</nav>
			<FeatureRow cards={shelf} activeHref={href} />

			<div className="mt-6 border-t border-rule pt-4 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
				<aside className="space-y-8">
					<SideNav entries={shopEntries(facets)} active={href} />
					{filtersAvailable && <ProductFilters facets={facets} showCategories={false} />}
				</aside>

				<div className="min-w-0">
					{filtersAvailable && (
						<div className="mb-4 lg:hidden">
							<ProductFiltersMobile facets={facets} showCategories={false} />
						</div>
					)}

					<Suspense fallback={<ProductGridSkeleton />}>
						<CategoryProducts
							slug={slug}
							name={category.name}
							canonicalPath={canonicalPath}
							filters={filters}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	);
};
