import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="py-3">
			<div className="mb-5 aspect-square animate-pulse bg-muted" />
			<div className="mb-3 space-y-2 md:mb-5">
				<div className="h-6 w-3/4 animate-pulse bg-muted" />
				<div className="hidden h-4 w-full animate-pulse bg-muted md:block" />
				<div className="h-4 w-1/4 animate-pulse bg-muted" />
			</div>
			<div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
		</div>
	);
}

export const PRODUCT_GRID = "grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-6 lg:grid-cols-4";

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(PRODUCT_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
