import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col overflow-hidden rounded-lg border-2 border-black/[0.05] bg-white/50 shadow-md xs:max-sm:flex-row">
			<div className="aspect-[4/3] w-full shrink-0 animate-pulse bg-well xs:max-sm:aspect-auto xs:max-sm:w-[45%]" />
			<div className="flex flex-1 flex-col gap-3 p-3 pt-4">
				<div className="h-6 w-3/4 animate-pulse rounded bg-secondary" />
				<div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
				<div className="mt-2 border-t pt-2">
					<div className="h-8 w-32 animate-pulse rounded-full bg-secondary" />
				</div>
			</div>
		</div>
	);
}

export const CARD_GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(CARD_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
