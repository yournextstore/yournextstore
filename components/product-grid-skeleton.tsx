import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="aspect-[15/17] animate-pulse rounded-lg bg-[#F5F5F5]" />
			<div className="flex justify-between gap-3 pt-2">
				<div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
				<div className="h-5 w-10 animate-pulse rounded bg-slate-100" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-12", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
