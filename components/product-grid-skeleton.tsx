import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ className }: { className?: string }) {
	return (
		<div className={className}>
			<div className="mb-4 aspect-square animate-pulse bg-grayscale-50 md:mb-6" />
			<div className="flex justify-between gap-4 max-md:flex-col max-md:gap-2">
				<div className="h-4 w-1/2 animate-pulse bg-grayscale-50" />
				<div className="h-4 w-1/5 animate-pulse bg-grayscale-50" />
			</div>
		</div>
	);
}

/** Mirrors the listing grid: two columns on phones, three from md, on the 12-column gutters. */
export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-12 gap-x-4 gap-y-10 md:gap-x-12 md:gap-y-16", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} className="col-span-6 md:col-span-4" />
			))}
		</div>
	);
}
