import { cn } from "@/lib/utils";

/** Same box as `ProductCard`: hairline card, square packshot, caption, name and price row. */
export function ProductCardSkeleton() {
	return (
		<div className="fc-card p-4">
			<div className="mb-3 aspect-square animate-pulse rounded-md bg-gray-100" />
			<div className="flex flex-col gap-3">
				<div className="h-[18px] w-1/3 animate-pulse rounded bg-gray-100" />
				<div className="h-[21px] w-3/4 animate-pulse rounded bg-gray-100" />
				<div className="flex items-center justify-between">
					<div className="h-[21px] w-1/4 animate-pulse rounded bg-gray-100" />
					<div className="h-[28px] w-16 animate-pulse rounded-md bg-gray-100" />
				</div>
			</div>
		</div>
	);
}

export const CARD_GRID = "grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3";

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(CARD_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
