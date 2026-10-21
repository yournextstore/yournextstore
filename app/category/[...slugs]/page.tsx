import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import { try_ } from "safe-try";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingSkeleton } from "@/components/listing-skeleton";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { getStoreName } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";
import { getFilterFacets } from "@/lib/facets";
import { LISTING_GRID } from "@/lib/grid";
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
			<div className="mx-auto flex max-w-xs flex-col gap-1.5 py-16 text-center">
				<h2 className="text-2xl font-bold">No products found</h2>
				<p className="text-muted-foreground">
					Try changing your filters, or check back later for new products
				</p>
			</div>
		);
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<div className={LISTING_GRID}>
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} headingLevel="h2" />
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
		<div className="shell grid grid-cols-1 min-h-svh content-start gap-8 pt-6 pb-8 lg:py-6">
			<div className="flex flex-col gap-2">
				<div className="h-8 w-56 animate-pulse rounded bg-secondary md:h-9" />
				<div className="h-5 w-72 max-w-full animate-pulse rounded bg-secondary" />
			</div>
			<ListingSkeleton />
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
	const [category, facets, storeName] = await Promise.all([
		getCategoryData(slug),
		getFilterFacets(),
		getStoreName(),
	]);
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
		<div className="shell grid grid-cols-1 min-h-svh content-start gap-8 pt-6 pb-8 lg:py-6">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<PageHeader>
				<PageHeaderHeading size="sm">{sentenceCase(category.name)}</PageHeaderHeading>
				<PageHeaderDescription size="sm">
					{hierarchy.length > 1 ? (
						<>
							{hierarchy.slice(0, -1).map((crumb, index) => (
								<Fragment key={crumb.slug}>
									<Link
										href={`/category/${hierarchy
											.slice(0, index + 1)
											.map((c) => c.slug)
											.join("/")}`}
										className="underline-offset-4 hover:underline"
									>
										{sentenceCase(crumb.name)}
									</Link>
									{" / "}
								</Fragment>
							))}
							{sentenceCase(category.name)}
						</>
					) : (
						`Browse ${sentenceCase(category.name).toLowerCase()} from ${storeName}`
					)}
				</PageHeaderDescription>
			</PageHeader>

			<section className="flex flex-col gap-6">
				<div className="flex items-center gap-2">
					{filtersAvailable ? <ProductFiltersMobile facets={facets} showCategories={false} /> : null}
				</div>
				<Suspense fallback={<ProductGridSkeleton />}>
					<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
				</Suspense>
			</section>
		</div>
	);
};
