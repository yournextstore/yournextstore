import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="rounded-sm border border-border p-1">
			<div className="aspect-square animate-pulse rounded-xs bg-secondary" />
			<div className="space-y-2 p-4">
				<div className="h-6 w-3/4 animate-pulse rounded-xs bg-secondary" />
				<div className="h-6 w-1/4 animate-pulse rounded-xs bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
