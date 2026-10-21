import { cn } from "@/lib/utils";

export const LISTING_GRID = "grid grid-cols-1 gap-x-4 sm:grid-cols-2 lg:grid-cols-4";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="h-72 animate-pulse bg-stage" />
			<div className="flex flex-col items-center gap-2 px-2 pt-4 pb-4">
				<div className="h-6 w-2/3 animate-pulse bg-stage" />
				<div className="h-6 w-1/4 animate-pulse bg-stage" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
