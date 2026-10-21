import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col overflow-hidden rounded-tile border border-line bg-foam">
			<div className="aspect-[4/5] w-full animate-pulse bg-muted" />
			<div className="flex flex-col gap-3 px-5 pb-[22px] pt-[18px]">
				<div className="flex justify-between gap-4">
					<div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
					<div className="h-5 w-14 animate-pulse rounded bg-muted" />
				</div>
				<div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
				<div className="mt-1 flex gap-2">
					<div className="h-6 w-20 rounded-full border border-line" />
					<div className="h-6 w-20 rounded-full border border-line" />
				</div>
			</div>
		</div>
	);
}

/** One card on phones, two on tablets, three from 1024px, with the shelf's gap. */
export const LISTING_GRID =
	"grid grid-cols-1 gap-[clamp(16px,2vw,26px)] min-[480px]:grid-cols-2 lg:grid-cols-3";

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
