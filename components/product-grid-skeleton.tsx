import { cn } from "@/lib/utils";

/** Same box as ProductCard (square image, 20px name line, 28px price line), so nothing shifts. */
export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-square animate-pulse rounded-lg bg-muted" />
			<div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-muted" />
			<div className="mt-1 h-7 w-1/4 animate-pulse rounded bg-muted" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 gap-x-4 gap-y-8 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10",
				className,
			)}
		>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
