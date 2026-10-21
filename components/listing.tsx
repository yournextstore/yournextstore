import Link from "next/link";
import { SortSelect } from "@/app/products/products-sort-select";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFiltersMobile } from "@/components/sections/product-filters";
import type { getFilterFacets } from "@/lib/facets";
import { SORT_OPTIONS } from "@/lib/sort";

type Facets = Awaited<ReturnType<typeof getFilterFacets>>;

/** "Filter" on the left, the grey sort select on the right — the original's listing bar. */
export function ListingToolbar({
	facets,
	showCategories = true,
	sortable = true,
}: {
	facets: Facets;
	showCategories?: boolean;
	sortable?: boolean;
}) {
	return (
		<div className="flex h-9 items-center justify-between gap-3">
			<ProductFiltersMobile facets={facets} showCategories={showCategories} />
			{sortable && (
				<SortSelect
					options={SORT_OPTIONS}
					className="h-9 min-w-[10.5rem] rounded-none border-0 bg-secondary text-sm shadow-none"
				/>
			)}
		</div>
	);
}

/** Same box as the toolbar, the count line and the first rows: the real list lands without a shift. */
export function ListingSkeleton() {
	return (
		<div className="min-h-svh">
			<div className="flex h-9 items-center justify-between">
				<div className="h-6 w-20 bg-secondary" />
				<div className="h-9 w-[10.5rem] bg-secondary" />
			</div>
			<div className="mt-8 mb-3 h-5 w-48 bg-secondary" />
			<ProductGridSkeleton />
		</div>
	);
}

export function ResultCount({ count }: { count: number }) {
	return (
		<p className="mt-8 mb-3 h-5 text-sm font-bold text-foreground">
			Found {count} matching {count === 1 ? "result" : "results"}
		</p>
	);
}

/** The peach chip row under the shop title. */
export function ChipLinks({ links }: { links: { href: string; label: string }[] }) {
	if (links.length === 0) return null;
	return (
		<ul className="mt-6 flex flex-wrap gap-1.5">
			{links.map((link) => (
				<li key={link.href}>
					<Link
						href={link.href}
						className="block rounded-xs bg-peach px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-pink"
					>
						{link.label}
					</Link>
				</li>
			))}
		</ul>
	);
}
