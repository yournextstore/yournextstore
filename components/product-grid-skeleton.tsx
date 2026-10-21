import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-[4/5] animate-pulse bg-muted" />
			<div className="mt-4 flex justify-between gap-3">
				<div className="h-4 w-2/3 animate-pulse bg-muted" />
				<div className="h-4 w-1/5 animate-pulse bg-muted" />
			</div>
		</div>
	);
}

/** Matches the listing grid: 2 columns, 3 from md, 4 from lg. */
export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div
			className={cn("grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4", className)}
		>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
