import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import { try_ } from "safe-try";
import { ListingHeader, ListingHeaderSkeleton } from "@/components/listing-header";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingLayout, ListingSidebar } from "@/components/listing-sidebar";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { getCategoryShowcases } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";
import { getFilterFacets } from "@/lib/facets";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";
import { sortOptionFor } from "@/lib/sort-options";

const PRODUCTS_PER_PAGE = 12;

// Filters that apply on top of the path-locked category.
type CategoryFilterParams = {
	page?: string;
	sort?: string;
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
	const sortOption = sortOptionFor(filters.sort);

	const result = await commerce.productBrowse({
		active: true,
		category: slug,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
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
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<div className={LISTING_GRID}>
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 2} />
				))}
			</div>
			<ListingPagination
				basePath={`/category/${canonicalPath}`}
				currentPage={currentPage}
				totalPages={totalPages}
				totalCount={result.meta.count}
				perPage={PRODUCTS_PER_PAGE}
				filters={filters}
			/>
		</>
	);
}

function CategoryPageSkeleton() {
	return (
		<div className="min-h-svh">
			<ListingHeaderSkeleton />
			<ListingLayout sidebar={<div className="h-64" />} className="border-t-2 border-border">
				<ProductGridSkeleton />
			</ListingLayout>
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

	const showcase = (await getCategoryShowcases()).find((entry) => entry.slug === category.slug);
	const image =
		typeof category.image === "string" && category.image ? category.image : (showcase?.frames[0] ?? null);
	const name = sentenceCase(category.name);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<ListingHeader
				pretitle={
					hierarchy.length > 1 ? (
						<nav aria-label="Breadcrumb">
							<ol className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
								{hierarchy.slice(0, -1).map((crumb, index) => (
									<Fragment key={crumb.slug}>
										<li>
											<Link
												href={`/category/${hierarchy
													.slice(0, index + 1)
													.map((c) => c.slug)
													.join("/")}`}
												className="hover:underline"
											>
												{sentenceCase(crumb.name)}
											</Link>
										</li>
										<li aria-hidden>/</li>
									</Fragment>
								))}
							</ol>
						</nav>
					) : (
						"Category"
					)
				}
				title={name}
				description={
					showcase
						? `${showcase.count} ${showcase.count === 1 ? "product" : "products"} in ${name.toLowerCase()}. Sort them by price or newest below.`
						: `Everything in ${name.toLowerCase()}, in one place.`
				}
				image={image}
			/>
			<ListingLayout
				className="border-t-2 border-border"
				sidebar={
					<ListingSidebar
						basePath={`/category/${canonicalPath}`}
						params={filters}
						categories={facets.categories}
						activeCategory={category.slug}
						filters={
							filtersAvailable ? <ProductFiltersMobile facets={facets} showCategories={false} /> : undefined
						}
					/>
				}
			>
				<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
			</ListingLayout>
		</div>
	);
};
