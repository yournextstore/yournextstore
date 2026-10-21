import type { APIProductFiltersResult } from "commerce-kit";
import { type ReactNode, Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

/** "N products" on the left, the filter button (below lg) and "Sort by" on the right. */
export function ListingToolbar({
	count,
	filters,
	sort,
}: {
	count: number;
	filters?: ReactNode;
	sort: ReactNode;
}) {
	return (
		<div className="flex h-12 items-center justify-between gap-3 pb-4">
			<p>
				{count} {count === 1 ? "product" : "products"}
			</p>
			<div className="flex items-center gap-1 sm:gap-2">
				{filters}
				<span className="hidden text-muted-foreground sm:inline">Sort by</span>
				{sort}
			</div>
		</div>
	);
}

/** Same groups the sidebar will render, collapsed, so the sidebar lands without a shift. */
export function FiltersSkeleton({ facets }: { facets: APIProductFiltersResult }) {
	const groups =
		(facets.categories.length > 0 ? 1 : 0) +
		(facets.collections.length > 0 ? 1 : 0) +
		facets.variantTypes.length +
		(facets.brands.length > 0 ? 1 : 0) +
		(facets.priceBounds.max > facets.priceBounds.min ? 1 : 0);
	return (
		<div className="hidden lg:block">
			<p className="border-b border-border pb-4 font-bold text-xl uppercase">Filters</p>
			{Array.from({ length: groups }, (_, i) => (
				<div key={`group-${i}`} className="h-[61px] border-b border-border" />
			))}
		</div>
	);
}

function ToolbarSkeleton() {
	return (
		<div className="flex h-12 items-center justify-between gap-3 pb-4">
			<div className="h-5 w-24 animate-pulse bg-secondary" />
			<div className="h-8 w-36 animate-pulse bg-secondary" />
		</div>
	);
}

/** The original's shop body: filters in a narrow left column, toolbar and grid on the right. */
export function ListingFrame({
	sidebar,
	fallbackSidebar,
	children,
}: {
	sidebar: ReactNode;
	fallbackSidebar: ReactNode;
	children: ReactNode;
}) {
	const shell = (side: ReactNode, main: ReactNode) => (
		<div className="flex min-h-svh flex-col px-3 py-8 md:px-20 lg:flex-row">
			{side && <div className="shrink-0 lg:mr-10 lg:ml-0 lg:basis-1/6 xl:mx-10">{side}</div>}
			<div className="flex min-w-0 flex-1 flex-col">{main}</div>
		</div>
	);
	return (
		<Suspense
			fallback={shell(
				fallbackSidebar,
				<>
					<ToolbarSkeleton />
					<ProductGridSkeleton />
				</>,
			)}
		>
			{shell(sidebar, children)}
		</Suspense>
	);
}
