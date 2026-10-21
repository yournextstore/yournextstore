import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="mb-3 aspect-[4/5] animate-pulse rounded-image bg-sand" />
			<div className="space-y-2">
				<div className="h-5 w-3/4 animate-pulse rounded bg-sand" />
				<div className="h-10 w-full animate-pulse rounded bg-sand" />
				<div className="h-5 w-1/4 animate-pulse rounded bg-sand" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
