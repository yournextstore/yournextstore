import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col gap-5 lg:gap-0 lg:rounded-md lg:bg-surface lg:shadow-soft">
			<div className="aspect-video animate-pulse rounded-md bg-surface lg:aspect-[4/3] lg:rounded-b-none lg:bg-line-soft" />
			<div className="space-y-3 lg:p-8">
				<div className="h-6 w-3/4 animate-pulse rounded bg-surface lg:bg-line-soft" />
				<div className="h-16 w-full animate-pulse rounded bg-surface lg:bg-line-soft" />
				<div className="flex items-center justify-between pt-1">
					<div className="h-6 w-20 animate-pulse rounded bg-surface lg:bg-line-soft" />
					<div className="h-10 w-20 animate-pulse rounded-md bg-surface lg:bg-line-soft" />
				</div>
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
