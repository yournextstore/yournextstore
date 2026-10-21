import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col">
			<div className="aspect-square w-full animate-pulse rounded-3xl bg-cream/60" />
			<div className="flex justify-between gap-4 px-1 pt-4">
				<div className="flex w-2/3 flex-col gap-2">
					<div className="h-6 animate-pulse rounded bg-ink/10" />
					<div className="h-4 w-1/2 animate-pulse rounded bg-ink/10" />
				</div>
				<div className="h-6 w-16 animate-pulse rounded bg-ink/10" />
			</div>
		</div>
	);
}

/** Two cards on phones, three from 768px, four from 1280px. */
export const LISTING_GRID =
	"grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 md:gap-y-12 xl:grid-cols-4";

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(LISTING_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
