import { productGridClass } from "@/components/product-card";
import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-[4/5] animate-pulse rounded-md bg-secondary" />
			<div className="mt-3 h-5 w-16 animate-pulse rounded bg-secondary" />
			<div className="mt-0.5 h-5 w-3/4 animate-pulse rounded bg-secondary" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(productGridClass, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
