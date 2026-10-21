import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { try_ } from "safe-try";
import {
	BannerSkeleton,
	ListingBanner,
	ListingResults,
	ListingResultsSkeleton,
	ListingShell,
	PriceChips,
	presentBuckets,
} from "@/components/bento/listing";
import { ListingPagination } from "@/components/listing-pagination";
import { editorialPhoto, richText } from "@/lib/aqua";
import { commerce } from "@/lib/commerce";
import { buildCategoryBreadcrumbJsonLd, JsonLdScript } from "@/lib/json-ld";
import {
	getListingSort,
	getPriceBucket,
	lowestPrice,
	priceBrowseParams,
	sortBrowseParams,
} from "@/lib/listing";

const PRODUCTS_PER_PAGE = 24;

// Filters that apply on top of the path-locked category.
type CategoryFilterParams = {
	page?: string;
	sort?: string;
	collection?: string;
	brand?: string;
	priceMin?: string;
	priceMax?: string;
	vts?: string;
	price?: string;
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

// Unfiltered prices for the chips: which buckets this category reaches at all.
async function getCategoryPrices(slug: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, category: slug, limit: 100 })
		.catch(() => ({ data: [] }));
	return data.map(lowestPrice);
}

async function CategoryProducts({
	category,
	canonicalPath,
	filters,
}: {
	category: { slug: string; name: string; image?: string | null; description?: unknown };
	canonicalPath: string;
	filters: CategoryFilterParams;
}) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const sort = getListingSort(filters.sort);
	const bucket = getPriceBucket(filters.price);
	const basePath = `/category/${canonicalPath}`;

	const [result, prices] = await Promise.all([
		commerce.productBrowse({
			active: true,
			category: category.slug,
			limit: PRODUCTS_PER_PAGE,
			offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
			...sortBrowseParams(sort),
			collection: filters.collection,
			brand: filters.brand,
			...(bucket
				? priceBrowseParams(bucket)
				: {
						priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
						priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
					}),
			vts: filters.vts,
		}),
		getCategoryPrices(category.slug),
	]);
	const query = { sort: filters.sort, price: bucket?.slug };
	const image = category.image ?? editorialPhoto(category.name, 0);

	return (
		<ListingResults
			products={result.data}
			basePath={basePath}
			sort={sort}
			query={query}
			empty={
				prices.length === 0
					? "No products found in this category."
					: "No products match these filters. Try clearing one."
			}
			before={
				<>
					<ListingBanner
						title={category.name}
						description={richText(category.description)}
						image={image}
						count={bucket ? result.meta.count : prices.length}
					/>
					<PriceChips
						basePath={basePath}
						buckets={presentBuckets(prices.filter((price) => price > 0))}
						query={query}
					/>
				</>
			}
			after={
				<ListingPagination
					basePath={basePath}
					currentPage={currentPage}
					totalPages={Math.ceil(result.meta.count / PRODUCTS_PER_PAGE)}
					filters={{ ...filters, price: bucket?.slug }}
				/>
			}
		/>
	);
}

function CategoryPageSkeleton() {
	return (
		<ListingShell activePath="">
			<ListingResultsSkeleton before={<BannerSkeleton />} />
		</ListingShell>
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
		<>
			<JsonLdScript data={buildCategoryBreadcrumbJsonLd(hierarchy)} />
			<ListingShell activePath={`/category/${canonicalPath}`}>
				<CategoryProducts
					category={{
						slug: category.slug,
						name: category.name,
						image: category.image,
						description: category.description,
					}}
					canonicalPath={canonicalPath}
					filters={filters}
				/>
			</ListingShell>
		</>
	);
};
