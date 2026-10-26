import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment } from "react";
import { try_ } from "safe-try";
import { getListingPage, ListingProducts } from "@/components/listing-products";
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
import { getFilterFacets, hasFacets } from "@/lib/facets";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";
import type { CategoryListingParams } from "@/lib/listing-routes";

// The SDK loads the parent chain up to 2 levels deep (self -> parent -> grandparent),
// so the canonical path is capped at 3 segments (e.g. fashion/tops/t-shirts).
type CategoryLike = { name: string; slug: string; parent?: CategoryLike | null };

const flattenParents = (category: CategoryLike): Array<{ name: string; slug: string }> => {
	const parent = category.parent;
	return [...(parent ? flattenParents(parent) : []), { name: category.name, slug: category.slug }];
};

export async function categoryMetadata(slugs: string[]): Promise<Metadata> {
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

// The SDK throws on a 404 despite its `| null` type. Without the null, the `!category`
// branches never run and an unknown slug answers 200 with the error page.
const getCategoryData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, category] = await try_(commerce.categoryGet({ idOrSlug: slug }));
	return error ? null : category;
};

/**
 * A category with or without filters. The default view (`/category/…` without a query) prerenders in full; a filter
 * or page number is rewritten to `/category-filtered/…`, which renders per request (lib/listing-routes.ts).
 */
export async function CategoryView({ slugs, filters }: { slugs: string[]; filters: CategoryListingParams }) {
	const slug = slugs.at(-1);
	if (!slug) {
		notFound();
	}

	// All cached and independent: the category, its facets and the listing page start together.
	const [category, facets] = await Promise.all([
		getCategoryData(slug),
		getFilterFacets(),
		getListingPage({ filters, category: slug }),
	]);
	if (!category?.active) {
		notFound();
	}
	// Category facet is hidden here (it's the page context), so don't count it.
	const filtersAvailable = hasFacets(facets, { categories: false });

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
						<BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
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
										<BreadcrumbLink render={<Link href={`/category/${path}`} />}>{crumb.name}</BreadcrumbLink>
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
				{filtersAvailable && <ProductFilters facets={facets} showCategories={false} active={filters} />}

				<div>
					{filtersAvailable && (
						<div className="mb-8 flex justify-end lg:hidden">
							<ProductFiltersMobile facets={facets} showCategories={false} active={filters} />
						</div>
					)}

					<ListingProducts basePath={`/category/${canonicalPath}`} filters={filters} category={slug} />
				</div>
			</div>
		</div>
	);
}
