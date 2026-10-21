import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-lg border border-border/60 bg-card">
			<div className="aspect-square animate-pulse bg-secondary" />
			<div className="space-y-3 p-4">
				<div className="h-6 w-3/4 animate-pulse rounded bg-secondary" />
				<div className="h-6 w-1/3 animate-pulse rounded bg-secondary" />
				<div className="h-9 w-full animate-pulse rounded-md bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
