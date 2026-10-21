import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="relative aspect-[4/5] bg-swag-paper">
			<div className="absolute top-[6%] left-1/2 aspect-[2/3] h-[78%] -translate-x-1/2 animate-pulse bg-swag-gray" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 lg:grid-cols-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
