import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="mb-3 aspect-[3/4] animate-pulse bg-neutral-lightest" />
			<div className="flex flex-col gap-1.5">
				<div className="h-4 w-3/4 animate-pulse bg-neutral-lightest" />
				<div className="h-4 w-1/3 animate-pulse bg-neutral-lightest" />
				<div className="h-4 w-1/4 animate-pulse bg-neutral-lightest" />
			</div>
		</div>
	);
}

export const LISTING_GRID =
	"grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-y-14";

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}

/** Filters + Sort row placeholder, the same height as the real toolbar. */
export function ListingToolbarSkeleton() {
	return (
		<div className="mb-6 flex gap-3 sm:justify-between md:mb-8">
			<div className="h-11 flex-1 animate-pulse rounded border border-border sm:w-28 sm:flex-none" />
			<div className="h-11 flex-1 animate-pulse rounded border border-border sm:w-40 sm:flex-none" />
		</div>
	);
}
