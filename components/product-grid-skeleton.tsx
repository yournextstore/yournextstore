import { cn } from "@/lib/utils";

// Matches ProductCard: square photograph, then a panel with name, category, variant count and price.
export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col overflow-hidden rounded-lg">
			<div className="aspect-square animate-pulse bg-secondary" />
			<div className="space-y-2 bg-linear-to-b from-transparent to-primary/5 p-4">
				<div className="h-6 w-3/4 animate-pulse rounded bg-secondary" />
				<div className="h-5 w-1/3 animate-pulse rounded bg-secondary" />
				<div className="h-5 w-1/4 animate-pulse rounded bg-secondary pt-10" />
				<div className="mt-8 flex justify-between">
					<div className="h-5 w-10 animate-pulse rounded bg-secondary" />
					<div className="h-6 w-16 animate-pulse rounded bg-secondary" />
				</div>
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-2 gap-y-4 sm:grid-cols-3 sm:gap-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
