import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-md border shadow-sm">
			<div className="aspect-[4/5] animate-pulse border-b bg-secondary" />
			<div className="space-y-2 p-4">
				<div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
				<div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
				<div className="h-4 w-1/4 animate-pulse rounded bg-secondary" />
			</div>
			<div className="flex gap-8 p-4 pt-1">
				<div className="h-8 flex-1 animate-pulse rounded-full bg-secondary" />
				<div className="size-8 animate-pulse rounded-full bg-secondary" />
			</div>
		</div>
	);
}

/** Matches the listing grid: one column on phones, then 2 · 3 · 4 like the original. */
export const productGridClass = "grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(productGridClass, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
