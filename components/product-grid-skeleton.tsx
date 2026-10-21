import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-191/150 w-full animate-pulse rounded-card border border-border bg-secondary" />
			<div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-secondary" />
			<div className="mt-2 h-3.5 w-1/3 animate-pulse rounded bg-secondary" />
		</div>
	);
}

export function ProductGridSkeleton({ className, count = 6 }: { className?: string; count?: number }) {
	return (
		<div className={cn("grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-3 lg:gap-x-5", className)}>
			{Array.from({ length: count }, (_, i) => (
				<ProductCardSkeleton key={i} />
			))}
		</div>
	);
}
