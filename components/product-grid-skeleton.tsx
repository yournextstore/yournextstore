import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-2xl border border-earth/5 bg-card/60">
			<div className="yns-image-shimmer aspect-3/4" />
			<div className="space-y-2 p-4">
				<div className="h-2.5 w-1/3 rounded bg-sand" />
				<div className="h-5 w-3/4 rounded bg-sand" />
				<div className="h-5 w-1/4 rounded bg-sand" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
