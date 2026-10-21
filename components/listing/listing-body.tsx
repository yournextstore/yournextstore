import type { APIProductFiltersResult } from "commerce-kit";
import type { ReactNode } from "react";
import { SortSelect } from "@/app/products/products-sort-select";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { sortOptions } from "@/lib/sort";
import { cn } from "@/lib/utils";

export const LISTING_GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3";

type FilterOptions = { showCategories?: boolean; showCollections?: boolean };

/** The original's 12-column listing: bordered filter card (3) beside the card grid (9). */
export function ListingBody({
	facets,
	filterOptions,
	sort = true,
	children,
}: {
	facets: APIProductFiltersResult | null;
	filterOptions?: FilterOptions;
	sort?: boolean;
	children: ReactNode;
}) {
	return (
		<div className={cn("mt-12 min-h-svh", facets && "lg:grid lg:grid-cols-12 lg:gap-12")}>
			{facets && <ProductFilters facets={facets} {...filterOptions} className="lg:col-span-3" />}
			<div className={cn(facets && "lg:col-span-9")}>
				<div className="mb-6 flex items-center justify-between gap-3">
					{facets ? <ProductFiltersMobile facets={facets} {...filterOptions} /> : <span />}
					{sort && <SortSelect options={sortOptions} className="ml-auto" />}
				</div>
				{children}
			</div>
		</div>
	);
}

/** Same boxes as `ListingBody`, without the client controls (they read search params). */
export function ListingBodySkeleton({
	withFilters = true,
	sort = true,
}: {
	withFilters?: boolean;
	sort?: boolean;
}) {
	return (
		<div className={cn("mt-12 min-h-svh", withFilters && "lg:grid lg:grid-cols-12 lg:gap-12")}>
			{withFilters && (
				<div className="hidden min-h-96 rounded-md border border-border lg:col-span-3 lg:block" />
			)}
			<div className={cn(withFilters && "lg:col-span-9")}>
				<div className="mb-6 flex h-9 items-center justify-between gap-3">
					{withFilters ? <div className="h-9 w-24 rounded-md border border-border lg:hidden" /> : <span />}
					{sort && <div className="ml-auto h-9 w-40 rounded-md border border-border" />}
				</div>
				<ProductGridSkeleton className={LISTING_GRID} actions />
			</div>
		</div>
	);
}
