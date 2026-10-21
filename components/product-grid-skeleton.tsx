import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-[2/3] animate-pulse bg-tint" />
			<div className="flex flex-col gap-2 px-0.5 pt-3.5">
				<div className="h-[19px] w-3/4 animate-pulse bg-tint" />
				<div className="h-[18px] w-1/4 animate-pulse bg-tint" />
			</div>
		</div>
	);
}

/** Mirrors the listing grid (two columns, four from lg) so the swap does not shift the page. */
export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
