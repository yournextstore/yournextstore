import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ imageClassName = "aspect-[9/14]" }: { imageClassName?: string }) {
	return (
		<div>
			<div className={cn("w-full animate-pulse rounded-lg bg-secondary", imageClassName)} />
			<div className="flex justify-between gap-3 py-2 md:py-3">
				<div className="h-5 w-1/2 animate-pulse rounded bg-secondary md:h-6 lg:h-7" />
				<div className="h-5 w-1/6 animate-pulse rounded bg-secondary md:h-6 lg:h-7" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-4", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} imageClassName="aspect-[4/5] sm:aspect-[9/14]" />
			))}
		</div>
	);
}
