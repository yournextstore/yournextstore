import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="card-ae overflow-hidden">
			<div className="p-3 pb-0 sm:p-4 sm:pb-0">
				<div className="aspect-[4/5] animate-pulse rounded-lg bg-muted" />
			</div>
			<div className="space-y-2 p-4">
				<div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
				<div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
				<div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
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
