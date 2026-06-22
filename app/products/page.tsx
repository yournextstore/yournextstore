import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { DEMO_PRODUCTS, isPreview, previewHref } from "@/lib/demo-products";
import { ProductsPagination } from "./products-pagination";

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
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

async function getFilterFacets() {
	"use cache";
	cacheLife("minutes");
	return commerce.productFilters();
}

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; sort?: string; preview?: string }>;
}): Promise<Metadata> {
	const sp = await searchParams;
	const preview = await isPreview(sp);
	const pageNum = Math.max(1, Number(sp.page) || 1);
	const canonical = pageNum > 1 ? `/products?page=${pageNum}` : "/products";
	const title = pageNum > 1 ? `All Products — Page ${pageNum}` : "All Products";

	if (preview) {
		return {
			title,
			description: "Browse the complete edit.",
			robots: { index: false, follow: false },
		};
	}

	return {
		title,
		description: "Browse our complete product collection.",
		alternates: { canonical },
		openGraph: {
			type: "website",
			title,
			description: "Browse our complete product collection.",
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

	const result = await commerce.productBrowse({
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
	});

	const totalPages = Math.ceil(result.meta.count / PRODUCTS_PER_PAGE);

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No pieces in the edit yet.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} previewMode={false} />
				))}
			</div>

			<ProductsPagination currentPage={currentPage} totalPages={totalPages} filters={filters} />
		</>
	);
}

async function PreviewProductList() {
	"use cache";
	cacheLife("minutes");
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
			{DEMO_PRODUCTS.map((product) => (
				<ProductCard key={product.id} product={product} previewMode />
			))}
		</div>
	);
}

function SortLink({
	option,
	filters,
}: {
	option: (typeof sortOptions)[number];
	filters: ProductFilterParams;
}) {
	const isActive = option.value === (filters.sort ?? "newest");

	// Preserve active filters when changing sort; reset to the first page.
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(filters)) {
		if (value && key !== "sort" && key !== "page") {
			params.set(key, value);
		}
	}
	if (option.value !== "newest") {
		params.set("sort", option.value);
	}
	const href = params.size ? `/products?${params}` : "/products";

	return (
		<YnsLink
			prefetch="eager"
			href={href}
			className={`text-[11px] uppercase tracking-[0.22em] transition-colors ${
				isActive
					? "text-foreground border-b border-foreground pb-1"
					: "text-muted-foreground hover:text-foreground"
			}`}
		>
			{option.label}
		</YnsLink>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	const preview = await isPreview(filters as Record<string, string | string[] | undefined>);
	const facets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
			<div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
				<YnsLink href={previewHref("/", preview)} className="hover:text-foreground transition-colors">
					Home
				</YnsLink>
				<span className="mx-2">/</span>
				<span className="text-foreground">All products</span>
			</div>

			<div className="mb-10 flex items-end gap-3">
				<h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.95] tracking-[-0.02em]">
					All Products
				</h1>
				<sup className="font-mono-cap text-[12px] text-muted-foreground tracking-[0.18em] -translate-y-3 sm:-translate-y-6">
					{preview ? DEMO_PRODUCTS.length : ""}
				</sup>
			</div>

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} />}

				<div>
					<div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
						<span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Sort by</span>
						{sortOptions.map((option) => (
							<SortLink key={option.value} option={option} filters={filters} />
						))}
						{filtersAvailable && <ProductFiltersMobile facets={facets} />}
					</div>

					{preview ? <PreviewProductList /> : <ProductList filters={filters} />}
				</div>
			</div>
		</div>
	);
}
