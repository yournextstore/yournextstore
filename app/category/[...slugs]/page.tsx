import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingHeader } from "@/components/listing-header";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingSkeleton, ListingToolbar, sortOptions } from "@/components/listing-toolbar";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/sections/product-filters";
import { richTextToPlain } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { listingCover } from "@/lib/editorial";
import { getFilterFacets } from "@/lib/facets";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";
import { cn } from "@/lib/utils";

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
	trail,
	facets,
	filtersAvailable,
}: {
	slug: string;
	canonicalPath: string;
	filters: CategoryFilterParams;
	trail: { href?: string; label: string }[];
	facets: Awaited<ReturnType<typeof getFilterFacets>>;
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
				trail={trail}
				count={result.meta.count}
				facets={facets}
				showFilters={filtersAvailable}
				showCategories={false}
			/>
			<div
				className={filtersAvailable ? "pt-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10" : "pt-6"}
			>
				{filtersAvailable && <ProductFilters facets={facets} showCategories={false} />}
				<div>
					{result.data.length === 0 ? (
						<div className="py-24 text-center">
							<p className="text-body text-muted-foreground">No products match these filters.</p>
						</div>
					) : (
						<div
							className={cn(
								"grid grid-cols-1 gap-x-3 gap-y-10 sm:grid-cols-2",
								filtersAvailable ? "xl:grid-cols-3" : "lg:grid-cols-3",
							)}
						>
							{result.data.map((product, index) => (
								<ProductCard
									key={product.id}
									product={product}
									priority={index < 2}
									sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
								/>
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
		</>
	);
}

function CategoryPageSkeleton() {
	return (
		<div className="page-x min-h-svh pt-8 pb-16 lg:pt-10">
			<div className="mb-10 grid gap-8 lg:grid-cols-2 lg:items-center">
				<div className="h-14 w-72 animate-pulse rounded-sm bg-secondary" />
				<div className="aspect-16/9 animate-pulse rounded-md bg-secondary" />
			</div>
			<ListingSkeleton withSidebar />
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

	const cover = category.image ?? listingCover(category.slug).src;
	const description = richTextToPlain(category.description);
	const trail = [
		{ href: "/", label: "Home" },
		...hierarchy.map((crumb, index) =>
			index === hierarchy.length - 1
				? { label: crumb.name }
				: {
						href: `/category/${hierarchy
							.slice(0, index + 1)
							.map((c) => c.slug)
							.join("/")}`,
						label: crumb.name,
					},
		),
	];

	return (
		<div className="page-x pt-8 pb-16 lg:pt-10 lg:pb-24">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<ListingHeader title={category.name} description={description} image={cover} />
			<CategoryProducts
				slug={slug}
				canonicalPath={canonicalPath}
				filters={filters}
				trail={trail}
				facets={facets}
				filtersAvailable={filtersAvailable}
			/>
		</div>
	);
};
