import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel">
			<div className="aspect-[16/10] w-full animate-pulse border-b border-line bg-kraft-2" />
			<div className="space-y-3 px-[1.2rem] pb-[1.3rem] pt-[1.1rem]">
				<div className="flex justify-between gap-4">
					<div className="h-6 w-2/3 animate-pulse rounded bg-kraft-2" />
					<div className="h-5 w-12 animate-pulse rounded bg-kraft-2" />
				</div>
				<div className="h-3 w-1/3 animate-pulse rounded bg-kraft-2" />
				<div className="h-10 w-full animate-pulse rounded bg-kraft-2" />
				<div className="h-6 w-20 animate-pulse rounded-full bg-kraft-2" />
			</div>
		</div>
	);
}

/** The original's range grid: three across, two under 940px, one under 580px. */
export const LISTING_GRID = "grid grid-cols-1 gap-[1.1rem] min-[580px]:grid-cols-2 min-[940px]:grid-cols-3";

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
