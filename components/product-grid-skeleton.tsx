import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="mb-12">
			<div className="mb-4 aspect-[4/5] animate-pulse bg-tint" />
			<div className="mb-2 h-6 w-3/4 animate-pulse bg-tint" />
			<div className="mb-2 h-10 w-full animate-pulse bg-tint" />
			<div className="h-8 w-full border-b border-black" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-x-4 sm:grid-cols-3 md:grid-cols-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
