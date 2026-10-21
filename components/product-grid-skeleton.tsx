import { cn } from "@/lib/utils";

export const PRODUCT_GRID_CLASS = "grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-square animate-pulse bg-secondary" />
			<div className="h-6 w-3/4 pt-3">
				<div className="h-4 w-full animate-pulse bg-secondary" />
			</div>
			<div className="mt-2 h-4 w-1/4 animate-pulse bg-secondary" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(PRODUCT_GRID_CLASS, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
