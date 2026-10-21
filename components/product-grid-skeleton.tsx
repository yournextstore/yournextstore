import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-lg shadow">
			<div className="aspect-[4/5] animate-pulse bg-secondary" />
			<div className="flex justify-between gap-4 px-5 py-6">
				<div className="h-6 w-1/2 animate-pulse rounded bg-secondary" />
				<div className="h-6 w-16 animate-pulse rounded bg-secondary" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid gap-12 md:grid-cols-2 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
