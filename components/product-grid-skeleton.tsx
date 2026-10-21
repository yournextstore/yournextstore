import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return <div className="aspect-4/5 animate-pulse rounded-xl bg-card" />;
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
