import type { APIProductFiltersResult } from "commerce-kit";
import Link from "next/link";
import type { ReactNode } from "react";
import { SortSelect } from "@/app/products/products-sort-select";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilterBar, ProductFiltersMobile } from "@/components/sections/product-filters";

export const listingFrame = "mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 md:py-16";
export const listingGrid = "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4";

/** Eyebrow, serif title with the result count on its baseline, one line of copy. */
export function ListingHeader({
	eyebrow,
	title,
	count,
	description,
}: {
	eyebrow: string;
	title: string;
	count?: ReactNode;
	description?: string | null;
}) {
	return (
		<div>
			<p className="mb-4 text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
				{eyebrow}
			</p>
			<div className="flex items-baseline justify-between gap-4">
				<h1 className="min-w-0 font-display text-4xl tracking-tight wrap-break-word md:text-5xl">{title}</h1>
				<span className="shrink-0 text-xs text-muted-foreground" aria-live="polite">
					{count}
				</span>
			</div>
			{description ? (
				<p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
			) : null}
		</div>
	);
}

/** Filters left, sort right, between two hairlines. Reads search params: render inside the grid's boundary. */
export function ListingToolbar({
	facets,
	sortOptions,
	showCategories = true,
	showCollections = true,
}: {
	facets: APIProductFiltersResult;
	sortOptions?: readonly { value: string; label: string }[];
	showCategories?: boolean;
	showCollections?: boolean;
}) {
	return (
		<div className="my-8 flex items-start justify-between gap-3 border-y py-5">
			<ProductFilterBar facets={facets} showCategories={showCategories} showCollections={showCollections} />
			<ProductFiltersMobile
				facets={facets}
				showCategories={showCategories}
				showCollections={showCollections}
			/>
			{sortOptions ? <SortSelect options={sortOptions} className="shrink-0" /> : null}
		</div>
	);
}

export function ListingSkeleton({ withSort = true }: { withSort?: boolean }) {
	return (
		<div className="min-h-svh">
			<div className="my-8 flex items-center justify-between gap-3 border-y py-5">
				<div className="flex gap-2">
					<div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
					<div className="hidden h-10 w-24 animate-pulse rounded-md bg-muted md:block" />
				</div>
				{withSort ? <div className="h-10 w-[172px] animate-pulse rounded-md bg-muted sm:w-[230px]" /> : null}
			</div>
			<ProductGridSkeleton className={listingGrid} />
		</div>
	);
}

export function EmptyListing({ clearHref }: { clearHref: string }) {
	return (
		<div className="rounded-xl border border-dashed py-20 text-center">
			<p className="font-display text-2xl text-foreground">No products found</p>
			<Link
				href={clearHref}
				className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4"
			>
				Clear filters
			</Link>
		</div>
	);
}
