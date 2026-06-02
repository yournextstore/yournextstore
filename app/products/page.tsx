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
	const title = pageNum > 1 ? `All Products — Page ${pageNum}` : "All Products";

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
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
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
			className={`text-sm transition-colors ${isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-10">
				<h1 className="text-3xl sm:text-4xl font-medium tracking-tight">All Products</h1>
				<p className="mt-2 text-muted-foreground">Browse our complete collection</p>
			</div>

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} />}

				<div>
					<div className="mb-8 flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-3">
							<span className="text-sm text-muted-foreground">Sort by:</span>
							{sortOptions.map((option) => (
								<SortLink key={option.value} option={option} filters={filters} />
							))}
						</div>
						{filtersAvailable && <ProductFiltersMobile facets={facets} />}
					</div>

					<ProductList filters={filters} />
				</div>
			</div>
		</div>
	);
}
