import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import { try_ } from "safe-try";
import { CategoryTabs, ListingSkeleton } from "@/components/bakery/listing";
import { SectionHeader } from "@/components/bakery/section-header";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { commerce } from "@/lib/commerce";
import { richTextToPlain } from "@/lib/display";
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
				<p className="font-sans text-body-lg text-muted-foreground">
					Nothing in the shop matches these filters.
				</p>
			</div>
		);
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
				{result.data.map((product, index) => (
					<li key={product.id}>
						<ProductCard product={product} priority={index === 0} headingLevel="h2" />
					</li>
				))}
			</ul>
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
		<div className="bake-container min-h-svh pt-4 pb-16 lg:pt-0 lg:pb-24">
			<div className="mb-8 h-5 w-48 animate-pulse rounded bg-surface" />
			<div className="mx-auto mb-8 h-12 w-64 animate-pulse rounded bg-surface lg:mb-12" />
			<div className="mb-10 h-11 animate-pulse rounded-md bg-surface lg:mb-14" />
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

	return (
		<div className="bake-container min-h-svh pt-4 pb-16 lg:pt-0 lg:pb-24">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<Breadcrumb className="mb-8">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/products">Shop</Link>
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

			<SectionHeader
				as="h1"
				title={category.name}
				subtitle={richTextToPlain(category.description) || "A section of our shop, neatly laid out"}
				className="mb-8 lg:mb-12"
			/>
			<CategoryTabs active={hierarchy[0]?.slug ?? null} />

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} showCategories={false} />}

				<div>
					{filtersAvailable && (
						<div className="mb-8 flex h-10 justify-end lg:hidden">
							<ProductFiltersMobile facets={facets} showCategories={false} />
						</div>
					)}

					<Suspense
						fallback={<ProductGridSkeleton className="sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" />}
					>
						<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
					</Suspense>
				</div>
			</div>
		</div>
	);
};
