import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-square animate-pulse rounded-lg bg-secondary" />
			<div className="space-y-2 px-3 pb-2 pt-3 sm:px-6 sm:pt-4">
				<div className="h-[1.5rem] w-3/4 animate-pulse rounded bg-secondary" />
				<div className="h-[1.35rem] w-1/4 animate-pulse rounded bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
