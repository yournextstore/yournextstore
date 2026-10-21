import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { SortSelect } from "@/app/products/products-sort-select";
import {
	BreadcrumbBar,
	ListingBody,
	ListingHero,
	ListingSkeleton,
	ListingToolbar,
	listingGridClass,
} from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { commerce } from "@/lib/commerce";
import { editorial } from "@/lib/editorial";
import { type FilterFacets, getFilterFacets } from "@/lib/facets";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";
import { displayName } from "@/lib/theme";

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

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
	facets,
	filtersAvailable,
}: {
	slug: string;
	canonicalPath: string;
	filters: CategoryFilterParams;
	facets: FilterFacets;
	filtersAvailable: boolean;
}) {
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

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<ListingToolbar
				count={result.meta.count}
				sort={<SortSelect options={sortOptions} />}
				filters={filtersAvailable ? <ProductFiltersMobile facets={facets} showCategories={false} /> : null}
			/>
			<ListingBody
				sidebar={
					filtersAvailable ? (
						<ProductFilters facets={facets} showCategories={false} className="lg:sticky lg:top-28" />
					) : null
				}
			>
				{result.data.length === 0 ? (
					<div className="py-24 text-center">
						<p className="text-lg text-muted-foreground">No products match these filters.</p>
					</div>
				) : (
					<ul className={listingGridClass}>
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
			</ListingBody>
		</>
	);
}

function CategoryPageSkeleton() {
	return (
		<div className="min-h-svh" aria-hidden="true">
			<div className="h-14 bg-surface" />
			<div className="h-[260px] bg-ink sm:h-[340px] lg:h-[400px]" />
			<div className="shell">
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

	const banner = category.image || editorial.groupBanner.src;
	const title = displayName(category.name);

	return (
		<div className="min-h-svh">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<BreadcrumbBar
				items={[
					{ label: "Home", href: "/" },
					{ label: "Shop", href: "/products" },
					...hierarchy.map((crumb, index) => ({
						label: displayName(crumb.name),
						href:
							index === hierarchy.length - 1
								? undefined
								: `/category/${hierarchy
										.slice(0, index + 1)
										.map((c) => c.slug)
										.join("/")}`,
					})),
				]}
			/>
			<ListingHero
				title={title}
				subtitle={
					typeof category.description === "string" && category.description
						? category.description
						: `Discover our curated selection of ${category.name}.`
				}
				image={banner}
			/>
			<div className="shell">
				<CategoryProducts
					slug={slug}
					canonicalPath={canonicalPath}
					filters={filters}
					facets={facets}
					filtersAvailable={filtersAvailable}
				/>
			</div>
		</div>
	);
};
