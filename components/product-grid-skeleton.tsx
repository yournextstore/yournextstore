import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col items-center">
			<div className="mb-5 aspect-square w-full animate-pulse bg-tile sm:mb-6" />
			<div className="flex w-full flex-col items-center gap-1">
				<div className="h-4.5 w-2/3 animate-pulse bg-secondary" />
				<div className="h-4.5 w-1/4 animate-pulse bg-secondary" />
			</div>
		</div>
	);
}

export const LISTING_GRID = "grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3";

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
