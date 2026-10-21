import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="lg:h-svh lg:min-h-[34rem]">
			<div className="aspect-[4/5] animate-pulse bg-panel lg:aspect-auto lg:h-full" />
			<div className="h-24 lg:hidden" />
		</div>
	);
}

/** Same boxes as the listing tiles, so the grid lands without a shift. */
export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid min-h-svh grid-cols-2 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
