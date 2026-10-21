import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col overflow-hidden rounded-[4px] bg-panel">
			<div className="aspect-[4/3] animate-pulse bg-panel-2" />
			<div className="space-y-3 p-6">
				<div className="h-4 w-24 animate-pulse rounded-[2px] bg-raise" />
				<div className="h-6 w-2/3 animate-pulse rounded-[2px] bg-raise" />
				<div className="h-12 w-full animate-pulse rounded-[2px] bg-raise" />
				<div className="h-6 w-20 animate-pulse rounded-[2px] bg-raise" />
				<div className="h-10 w-28 animate-pulse rounded-[2px] bg-raise" />
			</div>
		</div>
	);
}

/** The original's article grid: one column on phones, two from 641px, three from 1025px. */
export const LISTING_GRID = "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3";

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
