import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import type { getFilterFacets } from "@/lib/facets";
import { SortSelect } from "./products-sort-select";

export const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

export type Facets = Awaited<ReturnType<typeof getFilterFacets>>;

/** Count, filter row and sort, as in the original: one row from 640px, two pills on phones. */
export function ListingToolbar({
	facets,
	count,
	showCategories = true,
	showCollections = true,
}: {
	facets: Facets | null;
	count: number;
	showCategories?: boolean;
	showCollections?: boolean;
}) {
	return (
		<div className="flex flex-col gap-4">
			<p className="text-copy text-muted-foreground">{count === 1 ? "1 product" : `${count} products`}</p>
			<div className="grid w-full grid-cols-2 items-center justify-between gap-2 sm:flex sm:flex-wrap">
				{facets ? (
					<>
						<ProductFilters
							facets={facets}
							showCategories={showCategories}
							showCollections={showCollections}
						/>
						<ProductFiltersMobile
							facets={facets}
							showCategories={showCategories}
							showCollections={showCollections}
						/>
					</>
				) : (
					<span />
				)}
				<SortSelect options={sortOptions} />
			</div>
		</div>
	);
}

export function ListingToolbarSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<div className="h-[1.375rem] w-24 animate-pulse bg-secondary" />
			<div className="grid grid-cols-2 gap-2 sm:flex sm:justify-between">
				<div className="h-12 animate-pulse rounded-3xl bg-secondary sm:w-64 sm:rounded-none" />
				<div className="h-12 animate-pulse rounded-3xl bg-secondary sm:w-[17.5rem] sm:rounded-none" />
			</div>
		</div>
	);
}
