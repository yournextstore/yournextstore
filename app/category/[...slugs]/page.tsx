import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { SortSelect } from "@/app/products/products-sort-select";
import { EmptyResults } from "@/components/listing/empty-results";
import { ListingGrid, ListingLayout, ListingSkeleton } from "@/components/listing/listing-layout";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { picturedFirst } from "@/lib/catalog";
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

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

async function getCategoryProducts(slug: string, filters: CategoryFilterParams) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];

	return commerce.productBrowse({
		active: true,
		category: slug,
		limit: PRODUCTS_PER_PAGE,
		offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});
}

// Awaiting params/searchParams at the top of the page blocks the static shell —
// the page stays a sync shell and the dynamic content streams inside Suspense.
export default function CategoryPage(props: {
	params: Promise<{ slugs: string[] }>;
	searchParams: Promise<CategoryFilterParams>;
}) {
	return (
		<Suspense fallback={<ListingSkeleton />}>
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

	// All three reads are cached and independent — fetch them in parallel.
	const [category, facets, result] = await Promise.all([
		getCategoryData(slug),
		getFilterFacets(),
		getCategoryProducts(slug, filters),
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

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<ListingLayout
				title={category.name}
				count={result.meta.count}
				crumbs={[
					{ label: "Home", href: "/" },
					...hierarchy.map((crumb, index) => ({
						label: crumb.name,
						href: `/category/${hierarchy
							.slice(0, index + 1)
							.map((c) => c.slug)
							.join("/")}`,
					})),
				]}
				filters={filtersAvailable ? <ProductFilters facets={facets} showCategories={false} /> : null}
				mobileFilters={
					filtersAvailable ? <ProductFiltersMobile facets={facets} showCategories={false} /> : null
				}
				sort={<SortSelect options={sortOptions} />}
			>
				{result.data.length === 0 ? (
					<EmptyResults />
				) : (
					<>
						<ListingGrid>
							{picturedFirst(result.data).map((product, index) => (
								<ProductCard key={product.id} product={product} priority={index < 3} headingLevel="h2" />
							))}
						</ListingGrid>
						<ListingPagination
							basePath={`/category/${canonicalPath}`}
							currentPage={currentPage}
							totalPages={totalPages}
							filters={filters}
						/>
					</>
				)}
			</ListingLayout>
		</>
	);
};
