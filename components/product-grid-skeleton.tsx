import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col gap-[18px]">
			<div className="aspect-[37/36] w-full animate-pulse rounded-tile bg-cream" />
			<div className="flex justify-between gap-4">
				<div className="h-7 w-2/3 animate-pulse rounded bg-cream" />
				<div className="h-5 w-12 animate-pulse rounded bg-cream" />
			</div>
		</div>
	);
}

/** The original's grid: one column on phones, two on tablets, three from 980px. */
export const LISTING_GRID = "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3";

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
