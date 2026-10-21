import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			<div className="aspect-[3/4] animate-pulse bg-secondary" />
			<div className="mx-auto mt-1 h-8 w-3/4 animate-pulse bg-secondary" />
			<div className="mx-auto h-5 w-1/3 animate-pulse bg-secondary" />
			<div className="mx-auto h-7 w-1/4 animate-pulse bg-secondary" />
			<div className="mt-1 h-12 animate-pulse bg-secondary" />
			<div className="h-12 animate-pulse border border-border" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
