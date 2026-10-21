import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Crumbs } from "@/components/crumbs";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID, ListingSkeleton, ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { CategoryCircles } from "@/components/sections/home";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
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
			<div className="py-24 text-center">
				<p className="font-heading text-xl text-ink">No products match these filters.</p>
			</div>
		);
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<p className="mb-6 text-sm text-muted-foreground">
				{result.meta.count} {result.meta.count === 1 ? "product" : "products"}
			</p>
			<div className={LISTING_GRID}>
				{result.data.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						priority={index < 2}
						sizes="(max-width: 640px) 50vw, (max-width: 1280px) 30vw, 230px"
					/>
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
		<div className="min-h-svh pb-16">
			<div className="container-x pb-12 pt-10 md:pt-14">
				<div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-4 md:grid-cols-6 md:gap-6">
					{Array.from({ length: 6 }, (_, i) => (
						<div key={`circle-${i}`} className="aspect-square animate-pulse rounded-full bg-card" />
					))}
				</div>
			</div>
			<div className="container-x">
				<ListingSkeleton />
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

	return (
		<div className="min-h-svh pb-16">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<h1 className="sr-only">{category.name}</h1>
			<CategoryCircles activeSlug={hierarchy[0]?.slug} className="pb-12 pt-10 md:pt-14" />
			<div className="container-x">
				<div className={filtersAvailable ? "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10" : ""}>
					{filtersAvailable && <ProductFilters facets={facets} showCategories={false} />}

					<div className="min-w-0">
						<div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
							<Crumbs
								items={[
									{ label: "Home", href: "/" },
									{ label: "Shop", href: "/products" },
									...hierarchy.map((crumb, index) =>
										index === hierarchy.length - 1
											? { label: crumb.name }
											: {
													label: crumb.name,
													href: `/category/${hierarchy
														.slice(0, index + 1)
														.map((c) => c.slug)
														.join("/")}`,
												},
									),
								]}
							/>
							{filtersAvailable && <ProductFiltersMobile facets={facets} showCategories={false} />}
						</div>

						<Suspense fallback={<ProductGridSkeleton />}>
							<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
};
