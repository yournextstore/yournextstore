import { listingGrid } from "@/components/listing";
import { cn } from "@/lib/utils";

/** Same box as a ProductCard: 290/504px photograph, then the 96/104px caption block. */
export function ProductCardSkeleton() {
	return (
		<div>
			<div className="h-[18.125rem] animate-pulse bg-secondary sm:h-[31.5rem]" />
			<div className="flex flex-col items-center gap-4 p-4 sm:p-5">
				<div className="h-6 w-2/3 animate-pulse bg-secondary" />
				<div className="h-6 w-1/4 animate-pulse bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(listingGrid, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
