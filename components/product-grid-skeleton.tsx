import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col items-center">
			<div className="aspect-[7/8] w-full animate-pulse rounded-form bg-card" />
			<div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-muted" />
			<div className="mt-2 h-5 w-1/3 animate-pulse rounded bg-muted" />
		</div>
	);
}

export const LISTING_GRID = "grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4";

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}

/** Toolbar + grid placeholder with the same boxes as the real toolbar (no layout shift when it lands). */
export function ListingSkeleton() {
	return (
		<div>
			<div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
				<div className="h-5 w-28 animate-pulse rounded bg-muted" />
				<div className="flex items-center gap-3">
					<div className="h-10 w-24 animate-pulse rounded-form bg-muted lg:hidden" />
					<div className="h-10 w-40 animate-pulse rounded-form bg-muted" />
				</div>
			</div>
			<ProductGridSkeleton />
		</div>
	);
}
