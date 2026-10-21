import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingBand } from "@/components/listing-band";
import { ListingEmpty, ListingGrid, ListingGridSkeleton } from "@/components/listing-grid";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { richTextToPlain } from "@/lib/catalog";
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
	withFilters,
}: {
	slug: string;
	canonicalPath: string;
	filters: CategoryFilterParams;
	withFilters: boolean;
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
		return <ListingEmpty />;
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<ListingGrid products={result.data} withFilters={withFilters} />
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
		<div className="min-h-svh">
			<section data-band className="bg-lilac pt-10 pb-14 md:pt-16 md:pb-20">
				<div className="sp-container">
					<div className="h-5 w-48 animate-pulse bg-background/40" />
					<div className="mt-5 h-[46px] w-72 animate-pulse bg-background/40 md:h-[79px]" />
				</div>
			</section>
			<div className="sp-container py-[60px] md:py-[100px]">
				<ListingGridSkeleton withFilters={false} />
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

	const description = richTextToPlain(category.description);

	return (
		<>
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<ListingBand
				title={category.name}
				description={description || null}
				crumbs={[
					{ href: "/", label: "Home" },
					{ href: "/products", label: "Shop" },
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
				]}
			/>
			<div className="sp-container py-[60px] md:py-[100px]">
				<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
					{filtersAvailable && <ProductFilters facets={facets} showCategories={false} />}

					<div>
						{filtersAvailable && (
							<div className="mb-10 flex lg:hidden">
								<ProductFiltersMobile facets={facets} showCategories={false} />
							</div>
						)}

						<Suspense fallback={<ListingGridSkeleton withFilters={filtersAvailable} />}>
							<CategoryProducts
								slug={slug}
								canonicalPath={canonicalPath}
								filters={filters}
								withFilters={filtersAvailable}
							/>
						</Suspense>
					</div>
				</div>
			</div>
		</>
	);
};
