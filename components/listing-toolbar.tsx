import type { APIProductFiltersResult } from "commerce-kit";
import Link from "next/link";
import { SortSelect } from "@/app/products/products-sort-select";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";

export const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

/**
 * The original's listing toolbar: breadcrumb trail with the product count on the left, the
 * bordered "Sort by" select on the right, a hairline underneath. On phones the trail gives
 * way to Sort and Filter buttons.
 */
export function ListingToolbar({
	trail,
	count,
	facets,
	showFilters,
	showCategories = true,
	sort = true,
}: {
	trail: { href?: string; label: string }[];
	count: number;
	facets: APIProductFiltersResult;
	showFilters: boolean;
	showCategories?: boolean;
	sort?: boolean;
}) {
	return (
		<div className="flex items-center justify-between gap-4 border-b border-border pb-5">
			<p className="flex flex-wrap items-center gap-x-2 text-body-sm max-lg:hidden">
				{trail.map((crumb) => (
					<span key={crumb.label} className="inline-flex items-center gap-2">
						{crumb.href ? (
							<Link href={crumb.href} className="text-muted-foreground hover:text-foreground">
								{crumb.label}
							</Link>
						) : (
							<span className="text-muted-foreground">{crumb.label}</span>
						)}
						<span aria-hidden className="text-muted-foreground">
							/
						</span>
					</span>
				))}
				<span>
					{count} {count === 1 ? "product" : "products"}
				</span>
			</p>
			<div className="flex w-full items-center justify-between gap-3 lg:w-auto">
				{sort ? <SortSelect options={sortOptions} /> : <span />}
				{showFilters ? (
					<ProductFiltersMobile facets={facets} showCategories={showCategories} />
				) : (
					<span className="text-body-sm lg:hidden">
						{count} {count === 1 ? "product" : "products"}
					</span>
				)}
			</div>
		</div>
	);
}

export function ListingSkeleton({ withSidebar }: { withSidebar: boolean }) {
	return (
		<>
			<div className="flex h-15 items-center justify-between border-b border-border pb-5">
				<div className="h-5 w-56 rounded-sm bg-secondary max-lg:hidden" />
				<div className="h-10 w-40 rounded-md bg-secondary" />
			</div>
			<div className={withSidebar ? "pt-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10" : "pt-6"}>
				{withSidebar && <div className="hidden h-96 rounded-md bg-secondary/60 lg:block" />}
				<ProductGridSkeleton count={6} className={withSidebar ? "xl:grid-cols-3" : "lg:grid-cols-3"} />
			</div>
		</>
	);
}
