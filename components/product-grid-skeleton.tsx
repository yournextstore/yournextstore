import { autoGrid } from "@/lib/grid";
import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="grid gap-2">
			<div className="aspect-[3/4] animate-pulse bg-tile" />
			<div>
				<div className="h-6 w-3/4 animate-pulse rounded bg-secondary" />
				<div className="mt-0.5 h-6 w-1/4 animate-pulse rounded bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(autoGrid, "gap-y-8", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
