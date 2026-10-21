import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton, SHOP_GRID_CLASSES } from "@/components/product-grid-skeleton";
import { BANNER_TITLE, Banner } from "@/components/sections/hero";
import { ProductFiltersDialog } from "@/components/sections/product-filters";
import { BANNER_IMAGES } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { richToText } from "@/lib/display";
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
				<p className="text-sal-base text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<div className={SHOP_GRID_CLASSES}>
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
			<ListingPagination
				basePath={`/category/${canonicalPath}`}
				currentPage={currentPage}
				totalPages={totalPages}
				filters={filters}
			/>
		</>
	);
}

const PAGE = "min-h-svh px-4 pt-4 pb-12 md:px-8 lg:px-[100px] lg:pt-5 lg:pb-[100px]";

function CategoryPageSkeleton() {
	return (
		<div className={PAGE}>
			<div className="h-[260px] bg-[#ebe8e3] md:h-[400px]" />
			<div className="mt-14 mb-3 h-9 md:mt-24" />
			<ProductGridSkeleton />
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

	const description = richToText(category.description);
	const image = category.image ? { src: category.image, alt: category.name } : BANNER_IMAGES.listing;
	const parent = hierarchy.length > 1 ? hierarchy[hierarchy.length - 2] : null;

	return (
		<div className={PAGE}>
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<Banner image={image}>
				{parent && (
					<Link
						href={`/category/${hierarchy
							.slice(0, -1)
							.map((c) => c.slug)
							.join("/")}`}
						className="mb-3 inline-flex items-center gap-1.5 text-sal-nav font-bold text-foreground hover:underline"
					>
						<ArrowLeft aria-hidden="true" className="h-4 w-4" />
						{parent.name}
					</Link>
				)}
				<h1 className={BANNER_TITLE}>{category.name}</h1>
				{description && (
					<p className="mt-5 max-w-[27rem] text-sal-nav font-bold leading-6 text-paragraph">{description}</p>
				)}
			</Banner>

			<div className="mt-14 mb-3 flex h-9 items-center justify-end gap-2 md:mt-24">
				{filtersAvailable && <ProductFiltersDialog facets={facets} showCategories={false} />}
			</div>
			<h2 className="sr-only">Products</h2>
			<Suspense fallback={<ProductGridSkeleton />}>
				<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
			</Suspense>
		</div>
	);
};
