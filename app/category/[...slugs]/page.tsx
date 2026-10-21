import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import { try_ } from "safe-try";
import { ListingPagination } from "@/components/listing-pagination";
import { toolbarClass } from "@/components/njx/catalog-styles";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { getAllCategories, plainText } from "@/lib/catalog";
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

	if (result.data.length === 0) {
		return (
			<p className="py-10 text-center text-muted-foreground sm:py-16">No products match these filters.</p>
		);
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<p className="mb-4 text-[13px] text-muted-foreground">
				{result.meta.count} {result.meta.count === 1 ? "product" : "products"}
			</p>
			<div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 md:grid-cols-4">
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 2} headingLevel="h2" />
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
		<div className="mx-auto min-h-svh max-w-6xl px-5 pt-5 md:pt-6">
			<div className="h-5 w-40 animate-pulse rounded bg-tile" />
			<div className="mt-3 h-12 w-64 animate-pulse rounded-md bg-tile sm:h-14" />
			<div className="mt-7 mb-6 h-11 w-60 animate-pulse rounded-md bg-tile" />
			<ProductGridSkeleton count={4} />
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

	const allCategories = await getAllCategories();
	const children = allCategories.filter((c) => c.parentId === category.id);
	const pills =
		children.length > 0
			? [
					{ slug: canonicalPath, name: `All ${category.name}`, active: true },
					...children.map((c) => ({ slug: `${canonicalPath}/${c.slug}`, name: c.name, active: false })),
				]
			: allCategories
					.filter((c) => (c.parentId ?? null) === (category.parentId ?? null))
					.map((c) => {
						const parentPath = hierarchy
							.slice(0, -1)
							.map((h) => h.slug)
							.join("/");
						return {
							slug: parentPath ? `${parentPath}/${c.slug}` : c.slug,
							name: c.name,
							active: c.id === category.id,
						};
					});

	return (
		<div className="mx-auto min-h-svh max-w-6xl px-5 pt-5 pb-4 sm:pb-8 md:pt-6">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<nav aria-label="Breadcrumb" className="text-[13px] text-muted-foreground">
				<Link href="/" className="hover:text-ink">
					Home
				</Link>
				{hierarchy.map((crumb, index) => {
					const path = hierarchy
						.slice(0, index + 1)
						.map((c) => c.slug)
						.join("/");
					const isLast = index === hierarchy.length - 1;
					return (
						<Fragment key={crumb.slug}>
							<span aria-hidden className="mx-1.5">
								/
							</span>
							{isLast ? (
								<span aria-current="page" className="text-ink">
									{crumb.name}
								</span>
							) : (
								<Link href={`/category/${path}`} className="hover:text-ink">
									{crumb.name}
								</Link>
							)}
						</Fragment>
					);
				})}
			</nav>
			<h1 className="mt-3 font-display text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight wrap-break-word">
				{category.name}
			</h1>
			{plainText(category.description) ? (
				<p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
					{plainText(category.description)}
				</p>
			) : null}

			<div className={`mt-7 ${toolbarClass}`}>
				<nav aria-label="Categories" className="flex flex-wrap gap-2">
					{pills.map((pill) => (
						<Link
							key={pill.slug}
							href={`/category/${pill.slug}`}
							aria-current={pill.active ? "page" : undefined}
							className={
								pill.active
									? "rounded-md border border-pine bg-pine-soft px-3.5 py-2 text-[14px] font-semibold"
									: "rounded-md border border-line px-3.5 py-2 text-[14px] text-muted-foreground transition hover:border-ink hover:text-ink"
							}
						>
							{pill.name}
						</Link>
					))}
				</nav>
				{filtersAvailable ? <ProductFiltersMobile facets={facets} showCategories={false} /> : null}
			</div>

			<Suspense fallback={<ProductGridSkeleton count={4} />}>
				<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
			</Suspense>
		</div>
	);
};
