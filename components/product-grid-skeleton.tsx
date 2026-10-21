import { cn } from "@/lib/utils";

/** Same box as the product card (inset square photo, pill, name, price) so the grid does not shift. */
export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-2xl bg-card px-2.5 pt-2.5 pb-4 sm:px-3 sm:pt-3 sm:pb-5">
			<div className="aspect-square animate-pulse rounded-xl bg-subtle-2" />
			<div className="space-y-2 px-0.5">
				<div className="h-4 w-14 animate-pulse rounded-full bg-subtle" />
				<div className="h-4 w-3/4 animate-pulse rounded bg-subtle" />
				<div className="h-4 w-1/4 animate-pulse rounded bg-subtle" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
