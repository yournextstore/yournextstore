import { cn } from "@/lib/utils";

export const SHOP_GRID_CLASSES = "grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]";

export function ProductCardSkeleton() {
	return (
		<div className="h-[200px] border border-border bg-card sm:h-[230px]">
			<div className="h-20 animate-pulse bg-[#f6f6f6] sm:h-[100px]" />
			<div className="flex flex-col items-center p-4">
				<div className="h-5 w-2/3 animate-pulse bg-secondary" />
				<div className="mt-1.5 h-4 w-1/3 animate-pulse bg-secondary" />
				<div className="mt-4 h-6 w-1/2 animate-pulse bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 12, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(SHOP_GRID_CLASSES, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
