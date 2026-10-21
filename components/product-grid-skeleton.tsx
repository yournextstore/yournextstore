import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="mb-5 aspect-[9/10] w-full animate-pulse bg-secondary" />
			<div className="mb-1.5 h-5 w-3/4 animate-pulse rounded bg-secondary" />
			<div className="h-5 w-1/4 animate-pulse rounded bg-secondary" />
		</div>
	);
}

export const PRODUCT_GRID = "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5";

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(PRODUCT_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
