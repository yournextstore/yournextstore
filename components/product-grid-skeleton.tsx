import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="grid gap-[clamp(18px,3vw,30px)] rounded-[4px] border border-line bg-panel p-[clamp(20px,3.4vw,34px)] sm:grid-cols-[auto_1fr] sm:items-center">
			<div className="aspect-[4/3] animate-pulse rounded-[4px] bg-panel-2 sm:aspect-[3/4] sm:w-[clamp(104px,12vw,148px)]" />
			<div className="space-y-3">
				<div className="h-3 w-28 animate-pulse rounded-[2px] bg-panel-2" />
				<div className="h-8 w-2/3 animate-pulse rounded-[2px] bg-panel-2" />
				<div className="h-3 w-32 animate-pulse rounded-[2px] bg-panel-2" />
				<div className="h-16 w-full animate-pulse rounded-[2px] bg-panel-2" />
				<div className="h-10 w-full animate-pulse rounded-[2px] bg-panel-2" />
			</div>
		</div>
	);
}

/** The original's wine grid: one column, two from 760px, never more (each entry is a wide spec sheet). */
export const LISTING_GRID = "grid grid-cols-1 gap-5 md:grid-cols-2";

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
