import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
			<div className="space-y-2">
				<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
				<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
