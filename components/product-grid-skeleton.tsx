import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="hs-card p-2.5">
			<div className="aspect-square animate-pulse rounded-[10px] bg-secondary" />
			<div className="space-y-2 px-1.5 pb-1.5 pt-3.5">
				<div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
				<div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
				<div className="h-4 w-4/5 animate-pulse rounded bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
