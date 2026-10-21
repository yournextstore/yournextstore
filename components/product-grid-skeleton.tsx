import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-[4px] border border-line bg-panel">
			<div className="aspect-square animate-pulse bg-panel-2" />
			<div className="space-y-3 p-[clamp(18px,2vw,22px)]">
				<div className="h-3 w-16 animate-pulse bg-panel-2" />
				<div className="h-8 w-3/4 animate-pulse bg-panel-2" />
				<div className="h-7 w-full animate-pulse bg-panel-2" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3 lg:gap-5", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
