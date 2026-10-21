import { LISTING_GRID } from "@/lib/grid";
import { cn } from "@/lib/utils";

/** Same box as ProductCard: 3:4 image, name + price, button row. */
export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow">
			<div className="aspect-[3/4] animate-pulse border-b bg-secondary" />
			<div className="flex-1 space-y-2.5 p-4">
				<div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
				<div className="h-4 w-1/4 animate-pulse rounded bg-secondary" />
			</div>
			<div className="flex gap-2 p-4 pt-1">
				<div className="h-8 flex-1 animate-pulse rounded-sm bg-secondary" />
				<div className="size-8 animate-pulse rounded-md bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
