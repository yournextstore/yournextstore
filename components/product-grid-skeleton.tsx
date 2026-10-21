import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-[2px] border border-line bg-panel">
			<div className="aspect-square animate-pulse bg-panel-2" />
			<div className="space-y-3 p-[22px]">
				<div className="h-4 w-16 animate-pulse bg-panel-2" />
				<div className="h-8 w-3/4 animate-pulse bg-panel-2" />
				<div className="h-16 w-full animate-pulse bg-panel-2" />
				<div className="h-10 w-1/3 animate-pulse bg-panel-2" />
				<div className="h-11 w-full animate-pulse bg-panel-2" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
