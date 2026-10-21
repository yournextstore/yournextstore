import { cn } from "@/lib/utils";

export const CARD_GRID = "grid grid-cols-2 items-stretch gap-2 lg:grid-cols-4 lg:gap-4";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col rounded-2xl border border-neutral-100 p-2 shadow-sm sm:rounded-3xl lg:p-3 dark:border-neutral-800">
			<div className="aspect-square animate-pulse rounded-2xl bg-muted" />
			<div className="space-y-2 px-1 pt-3 pb-2 sm:pt-4">
				<div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
				<div className="mx-auto h-4 w-1/3 animate-pulse rounded bg-muted" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(CARD_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
