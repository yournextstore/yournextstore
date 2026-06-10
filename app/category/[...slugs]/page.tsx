import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import { ProductCard } from "@/components/product-card";
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
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";
import { CategoryPagination } from "./category-pagination";

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

const EMPTY_FACETS = {
	priceBounds: { min: 0, max: 0 },
	variantTypes: [],
	categories: [],
	collections: [],
	brands: [],
} satisfies Awaited<ReturnType<typeof commerce.productFilters>>;

async function getFilterFacets() {
	"use cache";
	cacheLife("minutes");
	// Filters are an enhancement — never let a facets failure take down the product list.
	try {
		return await commerce.productFilters();
	} catch {
		return EMPTY_FACETS;
	}
}

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

	const category = await commerce.categoryGet({ idOrSlug: slug });
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

function ProductGridSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={`skeleton-${i}`}>
					<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
					<div className="space-y-2">
						<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
						<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
					</div>
				</div>
			))}
		</div>
	);
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
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
			<CategoryPagination
				basePath={`/category/${canonicalPath}`}
				currentPage={currentPage}
				totalPages={totalPages}
				filters={filters}
			/>
		</>
	);
}

export default async function CategoryPage(props: {
	params: Promise<{ slugs: string[] }>;
	searchParams: Promise<CategoryFilterParams>;
}) {
	const { slugs } = await props.params;
	const filters = await props.searchParams;
	const slug = slugs.at(-1);
	if (!slug) {
		notFound();
	}

	const category = await commerce.categoryGet({ idOrSlug: slug });
	if (!category?.active) {
		notFound();
	}

	const facets = await getFilterFacets();
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
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
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

			<div className="mb-10">
				<h1 className="text-3xl sm:text-4xl font-medium tracking-tight">{category.name}</h1>
			</div>

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} showCategories={false} />}

				<div>
					{filtersAvailable && (
						<div className="mb-8 flex justify-end lg:hidden">
							<ProductFiltersMobile facets={facets} showCategories={false} />
						</div>
					)}

					<Suspense fallback={<ProductGridSkeleton />}>
						<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
