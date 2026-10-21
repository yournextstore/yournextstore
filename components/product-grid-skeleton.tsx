import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return <li className="aspect-square animate-pulse rounded-[1.75rem] bg-panel" />;
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<ul className={cn("grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</ul>
	);
}
