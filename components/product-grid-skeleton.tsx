import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-square animate-pulse rounded-lg bg-tile" />
			<div className="flex flex-col items-center gap-2 px-4 py-3">
				<div className="h-[21px] w-3/4 animate-pulse rounded bg-tile" />
				<div className="h-6 w-1/3 animate-pulse rounded bg-tile" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 md:grid-cols-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
