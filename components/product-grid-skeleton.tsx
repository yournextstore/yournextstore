import { cn } from "@/lib/utils";

export const CARD_GRID = "grid grid-cols-1 gap-x-2 gap-y-8 min-[440px]:grid-cols-2 lg:grid-cols-4";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-[4/5] animate-pulse border border-border bg-secondary" />
			<div className="mt-1.5 h-4 w-3/4 animate-pulse bg-secondary" />
			<div className="mt-1.5 h-4 w-1/4 animate-pulse bg-secondary" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(CARD_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
