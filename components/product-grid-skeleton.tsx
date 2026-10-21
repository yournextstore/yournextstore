import { cn } from "@/lib/utils";

export const LISTING_GRID = "grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3 lg:gap-8";

export function ProductCardSkeleton() {
	return (
		<div className="rounded-xl bg-card p-2 shadow-[0_2px_16px_rgb(4_38_80/0.12)]">
			<div className="aspect-square animate-pulse rounded-lg bg-tile" />
			<div className="space-y-2 px-2 pt-3 pb-2">
				<div className="h-6 w-3/4 animate-pulse rounded bg-secondary" />
				<div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
				<div className="mt-4 h-10 w-full animate-pulse rounded-md bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
