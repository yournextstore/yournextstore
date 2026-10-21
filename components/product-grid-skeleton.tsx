import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-sm border border-hairline-strong bg-panel">
			<div className="aspect-square animate-pulse bg-[var(--frame)]" />
			<div className="flex items-end justify-between gap-4 border-t border-hairline px-6 py-5">
				<div className="h-5 w-1/2 animate-pulse rounded-sm bg-muted" />
				<div className="h-6 w-16 animate-pulse rounded-sm bg-muted" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
