import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-lg shadow-lg">
			<div className="aspect-[2/3] animate-pulse bg-gray-100" />
			<div className="flex h-24 flex-col justify-center gap-2 bg-sky-wash p-4">
				<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
				<div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
			</div>
		</div>
	);
}

/** The original's listing grid: one card on phones, two from sm, three from md. */
export const LISTING_GRID = "mx-auto grid max-w-[18rem] gap-6 sm:max-w-none sm:grid-cols-2 md:grid-cols-3";

export function ProductGridSkeleton({ count = 9, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
