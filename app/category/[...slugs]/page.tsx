import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import { try_ } from "safe-try";
import {
	CatalogGrid,
	CatalogGridSkeleton,
	CatalogHeading,
	CatalogPagination,
	CategoryRow,
	PRODUCTS_PER_PAGE,
	parseSort,
	SortRow,
	sortQuery,
} from "@/components/catalog";
import { commerce } from "@/lib/commerce";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";

// Filters that apply on top of the path-locked category.
type CategoryFilterParams = {
	page?: string;
	sort?: string;
	dir?: string;
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
	const sort = parseSort(filters);

	const result = await commerce.productBrowse({
		active: true,
		category: slug,
		limit: PRODUCTS_PER_PAGE,
		offset,
		...sortQuery(sort),
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);
	const basePath = `/category/${canonicalPath}`;

	return (
		<>
			<SortRow basePath={basePath} current={sort} />
			<CatalogGrid products={result.data} />
			<CatalogPagination
				basePath={basePath}
				currentPage={currentPage}
				totalPages={totalPages}
				params={filters}
			/>
		</>
	);
}

function CategoryPageSkeleton() {
	return (
		<div className="shell min-h-svh">
			<div className="mb-10">
				<div className="h-4 w-40 animate-pulse rounded-sm bg-secondary" />
				<div className="mt-2 h-10 w-64 animate-pulse rounded-sm bg-secondary sm:h-12" />
			</div>
			<SortRow basePath="/products" />
			<CatalogGridSkeleton />
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

	const category = await getCategoryData(slug);
	if (!category?.active) {
		notFound();
	}

	const hierarchy = flattenParents(category as CategoryLike);
	const canonicalPath = hierarchy.map((c) => c.slug).join("/");
	const currentPath = slugs.join("/");
	if (currentPath !== canonicalPath) {
		permanentRedirect(`/category/${canonicalPath}`);
	}

	// Sub-categories drill down from here, like minshop's category tree.
	const rawChildren: unknown[] =
		"children" in category && Array.isArray(category.children) ? category.children : [];
	const children = rawChildren.flatMap((child) =>
		child &&
		typeof child === "object" &&
		"slug" in child &&
		"name" in child &&
		typeof child.slug === "string" &&
		typeof child.name === "string" &&
		!("active" in child && child.active === false)
			? [{ href: `/category/${canonicalPath}/${child.slug}`, label: child.name }]
			: [],
	);

	return (
		// Same floor as the skeleton, so the footer never jumps into view when a short listing lands.
		<div className="shell min-h-svh">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<CatalogHeading
				title={category.name}
				eyebrow={
					<nav aria-label="Breadcrumb">
						<ol className="flex flex-wrap items-center gap-x-2">
							<li>
								<Link href="/products" className="transition-colors hover:text-foreground">
									Shop
								</Link>
							</li>
							{hierarchy.map((crumb, index) => {
								const path = hierarchy
									.slice(0, index + 1)
									.map((c) => c.slug)
									.join("/");
								const isLast = index === hierarchy.length - 1;
								return (
									<Fragment key={crumb.slug}>
										<li aria-hidden="true">/</li>
										<li>
											{isLast ? (
												<span aria-current="page">{crumb.name}</span>
											) : (
												<Link href={`/category/${path}`} className="transition-colors hover:text-foreground">
													{crumb.name}
												</Link>
											)}
										</li>
									</Fragment>
								);
							})}
						</ol>
					</nav>
				}
			/>
			<CategoryRow links={children} />
			<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
		</div>
	);
};
