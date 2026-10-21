import { cn } from "@/lib/utils";

/** The listing grid: two columns on phones, three beside the filters from 1024px, 12px apart. */
export const PRODUCT_GRID = "grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-square animate-pulse rounded-sm bg-black/5" />
			<div className="mt-2 h-[17px] w-2/3 animate-pulse rounded-sm bg-black/5" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(PRODUCT_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
