import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
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
	searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
	const { page } = await searchParams;
	const pageNum = Math.max(1, Number(page) || 1);
	const canonical = pageNum > 1 ? `/products?page=${pageNum}` : "/products";
	const title = pageNum > 1 ? `All Products — Vela — Page ${pageNum}` : "All Products — Vela";

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
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{result.data.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			<ProductsPagination currentPage={currentPage} totalPages={totalPages} filters={filters} />
		</>
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
			className={`text-[0.72rem] uppercase tracking-[0.18em] transition-colors ${
				isActive
					? "border-b border-foreground pb-1 text-foreground"
					: "text-muted-foreground hover:text-foreground"
			}`}
		>
			{option.label}
		</YnsLink>
	);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	const facets = await getFilterFacets();
	const filtersAvailable =
		facets.categories.length > 0 ||
		facets.collections.length > 0 ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;

	return (
		<div className="section-shell-tight">
			<div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
				<div className="space-y-3">
					<p className="editorial-kicker">Product Index</p>
					<h1 className="section-title">All products</h1>
					<p className="max-w-2xl text-sm leading-7 text-muted-foreground">
						Browse the full catalog of furniture, lighting, and smaller objects selected for quieter
						interiors.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3 border-t border-border/80 pt-4 lg:border-t-0 lg:pt-0">
					<span className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">Sort</span>
					{sortOptions.map((option) => (
						<SortLink key={option.value} option={option} filters={filters} />
					))}
				</div>
			</div>

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} />}
				<div>
					{filtersAvailable && (
						<div className="mb-8 flex justify-end">
							<ProductFiltersMobile facets={facets} />
						</div>
					)}

					<ProductList filters={filters} />
				</div>
			</div>
		</div>
	);
}
