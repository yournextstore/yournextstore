import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingToolbar, ListingToolbarSkeleton, sortOptions } from "@/app/products/listing-toolbar";
import { ListingHead, listingGrid } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductCarousel } from "@/components/sections/product-carousel";
import { commerce } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";

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

async function browseCategory(slug: string, filters: CategoryFilterParams) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];

	const result = await commerce.productBrowse({
		active: true,
		category: slug,
		limit: PRODUCTS_PER_PAGE,
		offset,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});

	return { products: result.data, count: result.meta.count, currentPage };
}

async function getRecommended() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce.productBrowse({ active: true, limit: 9 }).catch(() => ({ data: [] }));
	return result.data;
}

function CategoryPageSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="shell flex flex-col gap-6 pt-8 sm:pt-11">
				<div className="h-6 w-48 animate-pulse bg-secondary" />
				<div className="h-12 w-72 animate-pulse bg-secondary md:h-14" />
			</div>
			<div className="shell flex flex-col gap-8 pt-12 pb-8">
				<ListingToolbarSkeleton />
				<ProductGridSkeleton />
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

	const [{ products, count, currentPage }, recommended] = await Promise.all([
		browseCategory(slug, filters),
		getRecommended(),
	]);
	const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE);
	const crumbs = [
		{ href: "/", label: "Home Page" },
		...hierarchy.map((crumb, index) => ({
			label: crumb.name,
			href:
				index === hierarchy.length - 1
					? undefined
					: `/category/${hierarchy
							.slice(0, index + 1)
							.map((c) => c.slug)
							.join("/")}`,
		})),
	];

	return (
		<>
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<div className="min-h-svh">
				<ListingHead crumbs={crumbs} title={category.name} />
				<div className="shell flex flex-col gap-8 pt-12 pb-8">
					<ListingToolbar facets={filtersAvailable ? facets : null} count={count} showCategories={false} />
					{products.length === 0 ? (
						<p className="py-10 text-center text-lead text-muted-foreground">No products.</p>
					) : (
						<div className={listingGrid}>
							{products.map((product, index) => (
								<ProductCard key={product.id} product={product} priority={index === 0} />
							))}
						</div>
					)}
					<ListingPagination
						basePath={`/category/${canonicalPath}`}
						currentPage={currentPage}
						totalPages={totalPages}
						filters={filters}
					/>
				</div>
			</div>
			<ProductCarousel title="Recommended products" products={recommended} />
		</>
	);
};
