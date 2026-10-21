import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="mb-2.5 aspect-square animate-pulse rounded-[13px] bg-tile lg:rounded-[20px] xl:mb-4" />
			<div className="space-y-2">
				<div className="h-5 w-3/4 animate-pulse rounded bg-pill xl:h-6" />
				<div className="h-6 w-1/3 animate-pulse rounded bg-pill xl:h-7" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 lg:gap-5", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
