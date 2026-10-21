import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, Suspense } from "react";
import { try_ } from "safe-try";
import { ListingGridSkeleton, ListingLayout } from "@/components/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCatalogCategories } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";
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
			<div className="min-h-svh py-24 text-center">
				<p className="text-lg">No products match these filters.</p>
			</div>
		);
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<div className="min-h-svh">
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{result.data.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						priority={index === 0}
						align="center"
						details
						headingLevel={2}
						sizes="(max-width: 640px) 100vw, (max-width: 992px) 33vw, 25vw"
					/>
				))}
			</div>
			<ListingPagination
				basePath={`/category/${canonicalPath}`}
				currentPage={currentPage}
				totalPages={totalPages}
				filters={filters}
			/>
		</div>
	);
}

function CategoryPageSkeleton() {
	return (
		<div className="container-ae min-h-svh pt-10 sm:pt-12">
			<div className="mb-4 h-5 w-56 animate-pulse rounded bg-muted" />
			<div className="flex items-end gap-6 border-b border-slate-line pb-4">
				<div className="h-10 flex-1 animate-pulse rounded bg-muted" />
				<div className="h-9 w-40 rounded-md border border-slate-line" />
			</div>
			<div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-12">
				<div className="h-40 md:col-span-4" />
				<div className="md:col-span-8">
					<ListingGridSkeleton />
				</div>
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

	// All reads are cached and independent — fetch them in parallel.
	const [category, facets, categories] = await Promise.all([
		getCategoryData(slug),
		getFilterFacets(),
		getCatalogCategories(),
	]);
	if (!category?.active) {
		notFound();
	}

	const hierarchy = flattenParents(category as CategoryLike);
	const canonicalPath = hierarchy.map((c) => c.slug).join("/");
	const currentPath = slugs.join("/");
	if (currentPath !== canonicalPath) {
		permanentRedirect(`/category/${canonicalPath}`);
	}

	return (
		<ListingLayout
			title={sentenceCase(category.name)}
			categories={categories}
			activeCategory={hierarchy[0]?.slug ?? category.slug}
			facets={facets}
			showSort={false}
			kicker={
				<>
					<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
					<Breadcrumb className="mb-4">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink render={<Link href="/products" />}>Shop</BreadcrumbLink>
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
												<BreadcrumbPage>{sentenceCase(crumb.name)}</BreadcrumbPage>
											) : (
												<BreadcrumbLink render={<Link href={`/category/${path}`} />}>
													{sentenceCase(crumb.name)}
												</BreadcrumbLink>
											)}
										</BreadcrumbItem>
									</Fragment>
								);
							})}
						</BreadcrumbList>
					</Breadcrumb>
				</>
			}
		>
			<Suspense fallback={<ListingGridSkeleton />}>
				<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
			</Suspense>
		</ListingLayout>
	);
};
