import { cn } from "@/lib/utils";

export const CARD_GRID = "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col items-center rounded-[20px] bg-shell p-4">
			<div className="mt-6 mb-5 aspect-square w-[78%] animate-pulse rounded-2xl bg-muted" />
			<div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
			<div className="mt-2 h-7 w-1/3 animate-pulse rounded bg-muted" />
			<div className="mt-4 h-[42px] w-full max-w-40 animate-pulse rounded-full bg-muted" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 10, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(CARD_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
