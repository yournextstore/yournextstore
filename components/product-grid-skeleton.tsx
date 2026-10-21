import { cn } from "@/lib/utils";

/** Two up on phones, three in the 640px app column: the original's product grid. */
export const PRODUCT_GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col gap-2.5 rounded-[30px] bg-white p-2.5 gf-shadow">
			<div className="aspect-[4/3] animate-pulse rounded-[20px] bg-flash-white" />
			<div className="space-y-2 px-1 pb-1">
				<div className="h-5 w-3/4 animate-pulse rounded-full bg-flash-white" />
				<div className="h-4 w-1/2 animate-pulse rounded-full bg-flash-white" />
				<div className="flex items-center justify-between pt-1">
					<div className="h-4 w-1/3 animate-pulse rounded-full bg-flash-white" />
					<div className="size-[34px] rounded-full bg-flash-white" />
				</div>
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(PRODUCT_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
