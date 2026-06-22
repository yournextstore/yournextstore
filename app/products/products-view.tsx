import type { Metadata } from "next";
import Link from "next/link";
import { SortLinks, SortSelect } from "@/app/products/products-sort-select";
import { getListingPage, ListingProducts } from "@/components/listing-products";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { getStoreSeo } from "@/lib/commerce";
import { getFilterFacets, hasFacets } from "@/lib/facets";
import type { ProductListingParams } from "@/lib/listing-routes";

// "Featured" follows the sort order the merchant set on the store's `all` collection (newest first without one).
const sortOptions = [
	{ value: "featured", label: "Featured", orderBy: "featured", orderDirection: "desc" },
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price ↑", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price ↓", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "A – Z", orderBy: "name", orderDirection: "asc" },
] as const;

export async function productsMetadata(page: string | undefined): Promise<Metadata> {
	const pageNum = Math.max(1, Number(page) || 1);
	const canonical = pageNum > 1 ? `/products?page=${pageNum}` : "/products";
	const title = pageNum > 1 ? `The Collection — Page ${pageNum}` : "The Collection";
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

/**
 * Every product. The default view (`/products` without a query) prerenders in full; a filter, sort or page number is
 * rewritten to `/products-filtered`, which renders per request (lib/listing-routes.ts).
 */
export async function ProductsView({ filters }: { filters: ProductListingParams }) {
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];
	const order = { orderBy: sortOption.orderBy, orderDirection: sortOption.orderDirection };
	// The listing page starts with the facets instead of after them; the grid below reads the same cache entry.
	const [facets] = await Promise.all([getFilterFacets(), getListingPage({ filters, order })]);
	const filtersAvailable = hasFacets(facets);

	return (
		<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
			<nav
				aria-label="Breadcrumb"
				className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground"
			>
				<Link href="/" className="hover:text-foreground transition-colors">
					Home
				</Link>
				<span aria-hidden>—</span>
				<span className="text-foreground">All</span>
			</nav>

			<div className="pt-6 pb-6 flex items-end gap-3 sm:gap-4">
				<h1 className="font-display text-5xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-[-0.01em] text-foreground uppercase">
					The Collection
				</h1>
			</div>

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} active={filters} />}

				<div>
					{/* Mobile/tablet toolbar: Filters button + compact Sort dropdown (sidebar is hidden below lg). */}
					<div className="pb-10 flex items-center justify-between gap-3 lg:hidden">
						{filtersAvailable ? <ProductFiltersMobile facets={facets} active={filters} /> : <span />}
						<SortSelect options={sortOptions} active={filters} />
					</div>

					{/* Desktop toolbar: inline sort links (filters live in the sidebar). */}
					<div className="pb-10 hidden flex-wrap items-center gap-3 lg:flex">
						<span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Sort</span>
						<SortLinks options={sortOptions} active={filters} />
					</div>

					<ListingProducts basePath="/products" filters={filters} order={order} />
				</div>
			</div>
		</div>
	);
}
