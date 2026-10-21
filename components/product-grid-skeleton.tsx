import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-4/5 animate-pulse rounded-md bg-secondary" />
			<div className="space-y-2 px-1 pt-3">
				<div className="h-3 w-1/4 animate-pulse rounded-sm bg-secondary" />
				<div className="h-4 w-3/4 animate-pulse rounded-sm bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-x-3 gap-y-10 sm:grid-cols-2", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
