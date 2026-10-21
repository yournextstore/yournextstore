import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { CatalogueGrid, CatalogueGridSkeleton, CatalogueHeader, FilterBar } from "@/components/catalogue";
import { ListingPagination } from "@/components/listing-pagination";
import { getCategories, richTextToPlain } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
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

	const [result, categories] = await Promise.all([
		commerce.productBrowse({
			active: true,
			category: slug,
			limit: PRODUCTS_PER_PAGE,
			offset,
			collection: filters.collection,
			brand: filters.brand,
			priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
			priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
			vts: filters.vts,
		}),
		getCategories(),
	]);

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);
	const chips = [
		{ label: "All pieces", href: "/products", current: false },
		...categories
			.filter((c) => c.count > 0 || c.slug === slug)
			.map((c) => ({ label: c.name, href: `/category/${c.slug}`, current: c.slug === slug })),
	];

	return (
		<>
			<FilterBar groups={[{ label: "Category", chips }]} count={result.meta.count} />
			<CatalogueGrid products={result.data} />
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
		<div className="shell min-h-svh">
			<section className="pb-12 pt-12 md:pb-16 md:pt-20">
				<div className="mb-8 h-3 w-40 bg-surface" />
				<div className="h-[clamp(2.75rem,8vw,6.5rem)] w-2/3 max-w-xl bg-surface" />
			</section>
			<div className="border-t border-border pb-10 pt-7">
				<div className="h-3 w-12 bg-surface" />
				<div className="mt-2.5 h-8 w-80 max-w-full bg-surface" />
			</div>
			<p className="border-t border-border py-4 text-[0.6875rem]">&nbsp;</p>
			<CatalogueGridSkeleton />
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

	return (
		<div className="shell min-h-svh">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<CatalogueHeader
				title={category.name}
				lead={
					richTextToPlain(category.description) ||
					`Every piece in ${category.name.toLowerCase()}, in one place.`
				}
				crumbs={[
					{ href: "/products", label: "Catalogue" },
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
			<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
		</div>
	);
};
