import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl border border-line">
			<div className="aspect-[4/5] animate-pulse bg-surface" />
			<div className="space-y-2 p-5">
				<div className="h-6 w-3/4 animate-pulse rounded bg-raised" />
				<div className="h-5 w-1/3 animate-pulse rounded bg-raised" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}

/**
 * Same box as a listing's toolbar, count and grid together, so nothing shifts when they
 * stream in: the filter panel column, the sort row and the first rows of cards.
 */
export function ListingSkeleton({ filters = true }: { filters?: boolean }) {
	return (
		<div className={filters ? "lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10" : ""}>
			{filters && <div className="glass hidden h-[28rem] lg:block" />}
			<div>
				<div className="mb-8 h-11 lg:mb-6 lg:h-5" />
				<div className="mb-8 h-5" />
				<ProductGridSkeleton count={6} className="xl:grid-cols-3 lg:grid-cols-2" />
			</div>
		</div>
	);
}
