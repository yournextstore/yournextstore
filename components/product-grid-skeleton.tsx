import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="text-center">
			<div className="h-[200px] animate-pulse rounded-md border border-border bg-light md:h-[269px]" />
			<div className="flex flex-col items-center gap-2 py-2 md:py-4">
				<div className="h-6 w-3/4 animate-pulse rounded bg-light" />
				<div className="mt-2 h-6 w-1/3 animate-pulse rounded bg-light" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div
			className={cn("grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 md:gap-y-14", className)}
		>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
