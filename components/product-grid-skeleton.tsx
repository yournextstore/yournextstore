import { cn } from "@/lib/utils";

export const LISTING_GRID = "grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-[2/3] animate-pulse rounded-md bg-secondary" />
			<div className="mt-4 flex justify-between gap-3">
				<div className="h-5 w-3/5 animate-pulse rounded bg-secondary" />
				<div className="h-5 w-1/4 animate-pulse rounded bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
