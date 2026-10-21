import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import { try_ } from "safe-try";
import { ListingBanner, ListingToolbar } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import { ProductGrid } from "@/components/sections/product-grid";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { editorial } from "@/lib/catalog";
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
		return <p className="py-10 text-center text-muted-foreground sm:py-16">No products match this filter.</p>;
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<ProductGrid products={result.data} />
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
		<>
			<section data-hero className="h-[42vh] min-h-[300px] animate-pulse bg-card" />
			<div className="shell min-h-svh pt-8">
				<div className="mb-6 h-5 w-48" />
				<div className="mb-6 h-[58px] rounded-2xl border border-border" />
				<ProductGridSkeleton />
			</div>
		</>
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

	const image = category.image ?? editorial.hero;

	return (
		<>
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<ListingBanner title={category.name} image={image} />
			<section aria-labelledby="category-products" className="shell min-h-svh pt-8 pb-4 sm:pb-8">
				<Breadcrumb className="mb-6">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{hierarchy.map((crumb, index) => {
							const path = hierarchy
								.slice(0, index + 1)
								.map((c) => c.slug)
								.join("/");
							const isLast = index === hierarchy.length - 1;
							return (
								<Fragment key={crumb.slug}>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage>{crumb.name}</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link href={`/category/${path}`}>{crumb.name}</Link>
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
								</Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
				<h2 id="category-products" className="sr-only">
					{category.name} products
				</h2>
				{filtersAvailable && (
					<ListingToolbar>
						<ProductFiltersMobile facets={facets} showCategories={false} />
					</ListingToolbar>
				)}
				{/* Cached, so it renders inside the page's boundary instead of streaming in after the footer. */}
				<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
			</section>
		</>
	);
};
