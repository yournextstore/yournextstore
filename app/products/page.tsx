import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { TextLink, tileGridClass } from "@/components/deckle";
import { type ChipGroup, ChipRows, FilterChips } from "@/components/filter-chips";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getCatalogProducts, getStoreBrand } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets } from "@/lib/facets";
import { picturedFirst } from "@/lib/pictured";

const PRODUCTS_PER_PAGE = 24;

const sortOptions = [
	{ value: "newest", label: "Newest", phrase: "newest first", orderBy: "createdAt", orderDirection: "desc" },
	{
		value: "price-asc",
		label: "Price, low to high",
		phrase: "lowest price first",
		orderBy: "price",
		orderDirection: "asc",
	},
	{
		value: "price-desc",
		label: "Price, high to low",
		phrase: "highest price first",
		orderBy: "price",
		orderDirection: "desc",
	},
	{ value: "name", label: "Name", phrase: "A to Z", orderBy: "name", orderDirection: "asc" },
] as const;

type ProductFilterParams = {
	page?: string;
	sort?: string;
	category?: string;
	collection?: string;
	brand?: string;
	priceMin?: string;
	priceMax?: string;
	vts?: string;
};

const FILTER_KEYS = ["category", "collection", "brand", "priceMin", "priceMax", "vts"] as const;

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
	const { page } = await searchParams;
	const pageNum = Math.max(1, Number(page) || 1);
	const canonical = pageNum > 1 ? `/products?page=${pageNum}` : "/products";
	const title = pageNum > 1 ? `All Products — Page ${pageNum}` : "All Products";
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Browse the complete ${storeName} collection. ${storeDescription}`
		: `Browse the complete ${storeName} product collection.`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title,
			description,
			url: canonical,
		},
	};
}

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const currentPage = Math.max(1, Number(filters.page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];

	const [result, { total }] = await Promise.all([
		commerce.productBrowse({
			active: true,
			limit: PRODUCTS_PER_PAGE,
			offset,
			orderBy: sortOption.orderBy,
			orderDirection: sortOption.orderDirection,
			category: filters.category,
			collection: filters.collection,
			brand: filters.brand,
			priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
			priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
			vts: filters.vts,
		}),
		getCatalogProducts(),
	]);

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);
	const filtered = FILTER_KEYS.some((key) => filters[key]);
	const count = result.meta.count;

	return (
		<>
			<ResultLine>
				<strong className="font-semibold">
					{count === 1 ? "1 product" : `${count} products`}
					{filtered && total > count ? ` of ${total}` : ""}, {sortOption.phrase}
				</strong>
				{filtered && <TextLink href="/products">Clear the filters</TextLink>}
			</ResultLine>

			{result.data.length === 0 ? (
				<p className="py-16 text-lg text-muted-foreground">Nothing matches these filters.</p>
			) : (
				<ul className={tileGridClass}>
					{(sortOption.value === "newest" ? picturedFirst(result.data) : result.data).map(
						(product, index) => (
							<li key={product.id}>
								<ProductCard product={product} priority={index < 2} />
							</li>
						),
					)}
				</ul>
			)}

			<ListingPagination
				basePath="/products"
				currentPage={currentPage}
				totalPages={totalPages}
				filters={filters}
			/>
		</>
	);
}

function ResultLine({ children }: { children: React.ReactNode }) {
	return (
		<p
			aria-live="polite"
			className="mt-12 mb-6 flex min-h-[3.1rem] flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-border pt-6"
		>
			{children}
		</p>
	);
}

// Awaits `searchParams` (runtime data) inside a Suspense boundary so the page shell
// stays prerenderable; `ProductList` remains cached, keyed on the resolved filters.
async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

function ProductSectionSkeleton() {
	return (
		<>
			<ResultLine>
				<span className="h-5 w-48 animate-pulse rounded bg-secondary" />
			</ResultLine>
			<ProductGridSkeleton count={PRODUCTS_PER_PAGE} />
		</>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	// `facets` is cached and independent of `searchParams`, so the filter rows can be laid out in
	// the prerendered shell; only which chip is inked waits for the URL.
	const [facets, brand, { products: catalog }] = await Promise.all([
		getFilterFacets(),
		getStoreBrand(),
		getCatalogProducts(),
	]);
	// Only categories that hold a product: an empty one would be a chip that filters to nothing.
	const filledCategories = facets.categories.filter((c) => catalog.some((p) => p.category?.slug === c.slug));
	const groups: ChipGroup[] = [
		...(filledCategories.length > 0
			? [
					{
						label: "Category",
						param: "category",
						all: "All",
						options: filledCategories.map((c) => ({ label: c.name, value: c.slug })),
					},
				]
			: []),
		...(facets.brands.length > 0
			? [
					{
						label: "Brand",
						param: "brand",
						all: "All",
						options: facets.brands.map((b) => ({ label: b.name, value: b.slug })),
					},
				]
			: []),
		...facets.variantTypes.map((vt) => ({
			label: vt.label,
			param: `vts:${vt.label}`,
			all: "Any",
			options: vt.values.map((value) => ({ label: value, value })),
		})),
		{
			label: "Sort",
			param: "sort",
			fallback: sortOptions[0].value,
			options: sortOptions.map((s) => ({ label: s.label, value: s.value })),
		},
	];

	return (
		<>
			<section aria-labelledby="products-title" className="band">
				<div className="grid justify-items-start gap-6">
					<h1 id="products-title" className="max-w-[20ch] text-title-1 text-balance">
						All products
					</h1>
					<p className="max-w-[52ch] text-lg text-muted-foreground">
						{brand.description || `Everything in the ${brand.name} shop, in one place.`}
					</p>
					<Suspense fallback={<ChipRows groups={groups} label="Filter the products" pathname="/products" />}>
						<FilterChips groups={groups} label="Filter the products" />
					</Suspense>
				</div>

				<Suspense fallback={<ProductSectionSkeleton />}>
					<ProductSection searchParams={searchParams} />
				</Suspense>
			</section>

			<section aria-labelledby="collections-aside" className="band bg-band">
				<div className="grid justify-items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
					<div>
						<h2 id="collections-aside" className="text-title-2 text-balance">
							Pieces that belong together
						</h2>
						<p className="mt-3 max-w-[56ch] text-muted-foreground">
							Every collection gathers the pieces made to sit side by side, so a room comes together in one
							go.
						</p>
					</div>
					<TextLink href="/collections" arrow>
						See the collections
					</TextLink>
				</div>
			</section>
		</>
	);
}
