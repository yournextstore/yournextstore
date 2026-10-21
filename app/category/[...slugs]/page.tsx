import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { type Chip, EmptyListing, ListingSkeleton, PageHead, ShopTools } from "@/components/garden/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { plainText } from "@/lib/garden";
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
	chips,
}: {
	slug: string;
	canonicalPath: string;
	filters: CategoryFilterParams;
	chips: Chip[];
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

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<ShopTools chips={chips} shown={result.data.length} total={result.meta.count} sortable={false} />
			{result.data.length === 0 ? (
				<EmptyListing message="Nothing in this category matches these filters." />
			) : (
				<div className="shop-grid">
					{result.data.map((product, index) => (
						<ProductCard
							key={product.id}
							product={product}
							priority={index === 0}
							showNote
							headingLevel="h2"
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
		</>
	);
}

function CategoryPageSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="page-head">
				<div className="wrap">
					<div className="h-4 w-40 rounded bg-[var(--paper-3)]" />
					<div className="mt-5 h-12 w-72 max-w-full rounded bg-[var(--paper-3)]" />
				</div>
			</div>
			<div className="wrap">
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
	const hierarchy = flattenParents(category as CategoryLike);
	const canonicalPath = hierarchy.map((c) => c.slug).join("/");
	const currentPath = slugs.join("/");
	if (currentPath !== canonicalPath) {
		permanentRedirect(`/category/${canonicalPath}`);
	}

	const chips: Chip[] = [
		{ href: "/products", label: "Everything", active: false },
		...facets.categories.map((c) => ({
			href: `/category/${c.slug}`,
			label: c.name,
			active: c.slug === category.slug,
		})),
	];
	const description = plainText(category.description);

	return (
		<div className="min-h-svh pb-[clamp(3rem,6vw,5rem)]">
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<PageHead
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
				title={category.name}
				lede={
					description.length > 40
						? description
						: `Everything we keep in ${category.name.toLowerCase()}, chosen with care.`
				}
				note={
					<>
						Little things,
						<br />
						big comfort.
					</>
				}
			/>
			<div className="wrap">
				<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} chips={chips} />
			</div>
		</div>
	);
};
