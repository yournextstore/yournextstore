import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { Crumbs } from "@/components/crumbs";
import { ListingPagination } from "@/components/listing-pagination";
import { ListingGridFallback, NothingFound, ResultCount } from "@/components/listing-results";
import { ListingToolbar, SORT_OPTIONS } from "@/components/listing-toolbar";
import { ProductCard } from "@/components/product-card";
import { CARD_GRID } from "@/components/product-grid-skeleton";
import { commerce } from "@/lib/commerce";
import { richTextToPlain } from "@/lib/display";
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
	const sortOption = SORT_OPTIONS.find((s) => s.value === filters.sort) ?? SORT_OPTIONS[0];

	const result = await commerce.productBrowse({
		active: true,
		category: slug,
		orderBy: sortOption.orderBy,
		orderDirection: sortOption.orderDirection,
		limit: PRODUCTS_PER_PAGE,
		offset,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<ResultCount count={result.meta.count} />
			{result.data.length === 0 ? (
				<NothingFound />
			) : (
				<div className={CARD_GRID}>
					{result.data.map((product, index) => (
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
		</>
	);
}

function CategoryPageSkeleton() {
	return (
		<div className="shop-container min-h-svh pb-20">
			<div className="py-6">
				<div className="h-[16.5px] w-48 animate-pulse rounded bg-secondary" />
			</div>
			<div className="border-b border-border pb-8">
				<div className="mb-2 h-3 w-20 animate-pulse rounded bg-secondary" />
				<div className="h-[clamp(3.1rem,7.5vw,6.25rem)] w-72 max-w-full animate-pulse rounded bg-secondary" />
			</div>
			<div className="border-b border-border py-5">
				<div className="h-10 w-full max-w-xs animate-pulse rounded-full bg-secondary" />
			</div>
			<ListingGridFallback />
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

	const category = await getCategoryData(slug);
	if (!category?.active) {
		notFound();
	}

	const hierarchy = flattenParents(category as CategoryLike);
	const canonicalPath = hierarchy.map((c) => c.slug).join("/");
	const currentPath = slugs.join("/");
	if (currentPath !== canonicalPath) {
		permanentRedirect(`/category/${canonicalPath}`);
	}
	const description = richTextToPlain(category.description);

	return (
		<div className="shop-container min-h-svh pb-20">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<Crumbs
				items={[
					{ href: "/", label: "Home" },
					{ href: "/categories", label: "Categories" },
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
			<div className="border-b border-border pb-8">
				<p className="kicker mb-2">Category</p>
				<h1 className="wrap-break-word font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-tight text-foreground">
					{category.name}
				</h1>
				{description && <p className="mt-3 max-w-xl text-base text-muted-foreground">{description}</p>}
			</div>
			<ListingToolbar activeCategory={category.slug} />
			<Suspense fallback={<ListingGridFallback />}>
				<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
			</Suspense>
		</div>
	);
};
