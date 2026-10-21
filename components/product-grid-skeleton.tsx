import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-square animate-pulse rounded-md bg-gray-100 motion-reduce:animate-none" />
			<div className="space-y-3 p-4">
				<div className="h-4 w-3/4 animate-pulse rounded bg-gray-100 motion-reduce:animate-none" />
				<div className="h-6 w-1/3 animate-pulse rounded bg-gray-100 motion-reduce:animate-none" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-6 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
