import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import { ListingPagination } from "@/components/listing-pagination";
import { MenuChips, MenuGrid, MenuLayout, MenuSidebar, SectionHeader } from "@/components/menu";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getMenuCategories } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";

const PRODUCTS_PER_PAGE = 24;

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
		return <p className="py-16 text-body-md text-muted-foreground">Nothing in this category yet.</p>;
	}

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	return (
		<>
			<MenuGrid>
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 2} headingLevel="h2" />
				))}
			</MenuGrid>
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
		<MenuLayout leading={<div className="h-64" />} className="min-h-svh">
			<div className="mb-2 h-4 w-24 animate-pulse rounded bg-secondary" />
			<div className="mb-6 h-10 w-56 animate-pulse rounded bg-secondary" />
			<div className="mb-5 h-9 w-full max-w-md animate-pulse rounded-full bg-secondary lg:hidden" />
			<ProductGridSkeleton />
		</MenuLayout>
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

	const [category, categories] = await Promise.all([getCategoryData(slug), getMenuCategories()]);
	if (!category?.active) {
		notFound();
	}

	const hierarchy = flattenParents(category as CategoryLike);
	const canonicalPath = hierarchy.map((c) => c.slug).join("/");
	const currentPath = slugs.join("/");
	if (currentPath !== canonicalPath) {
		permanentRedirect(`/category/${canonicalPath}`);
	}

	const links = [
		{ href: "/products", label: "All items" },
		...categories.map((c) => ({
			href: `/category/${c.path}`,
			label: c.name,
			current: c.path === canonicalPath,
		})),
	];
	const parents = hierarchy.slice(0, -1);
	const description =
		"description" in category && typeof category.description === "string" ? category.description : null;

	return (
		<MenuLayout leading={<MenuSidebar links={links} />}>
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<nav
				aria-label="Breadcrumb"
				className="mb-2 text-label-sm uppercase tracking-[0.12em] text-muted-foreground"
			>
				<Link href="/products" className="hover:text-foreground">
					Shop
				</Link>
				{parents.map((crumb, index) => (
					<span key={crumb.slug}>
						{" · "}
						<Link
							href={`/category/${hierarchy
								.slice(0, index + 1)
								.map((c) => c.slug)
								.join("/")}`}
							className="hover:text-foreground"
						>
							{crumb.name}
						</Link>
					</span>
				))}
			</nav>
			<SectionHeader as="h1" title={category.name} description={description} />
			<MenuChips links={links} label="Menu categories" />
			<Suspense fallback={<ProductGridSkeleton />}>
				<CategoryProducts slug={slug} canonicalPath={canonicalPath} filters={filters} />
			</Suspense>
		</MenuLayout>
	);
};
