import { cn } from "@/lib/utils";

/** The original's shimmering card skeleton. */
export function ProductCardSkeleton() {
	return (
		<div className="rounded-2xl bg-card p-2">
			<div className="kara-shimmer aspect-[4/5] rounded-2xl" />
			<div className="mt-3 space-y-3 px-1 pb-1">
				<div className="flex gap-2">
					{[0, 1, 2, 3].map((i) => (
						<div key={i} className="kara-shimmer h-10 w-10 rounded-full" />
					))}
				</div>
				<div className="kara-shimmer h-4 w-full rounded-lg" />
				<div className="kara-shimmer h-4 w-1/2 rounded-lg" />
				<div className="flex justify-between">
					<div className="kara-shimmer h-5 w-1/3 rounded-lg" />
					<div className="kara-shimmer h-9 w-9 rounded-full" />
				</div>
			</div>
		</div>
	);
}

export const KARA_GRID = "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3";

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(KARA_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
