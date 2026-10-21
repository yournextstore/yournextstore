import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col items-center">
			<div className="aspect-square w-full animate-pulse rounded-lg bg-[#f4ebdb]" />
			<div className="flex w-full flex-col items-center gap-1 px-lg py-s">
				<div className="h-[27px] w-3/4 animate-pulse rounded bg-[#f4ebdb] lg:h-[30px]" />
				<div className="h-[21px] w-1/3 animate-pulse rounded bg-[#f4ebdb] lg:h-6" />
			</div>
		</div>
	);
}

/** Same grid as the listings: two up on phones, three from lg. */
export const productGridClass = "grid grid-cols-2 gap-x-2 gap-y-4 lg:grid-cols-3";

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(productGridClass, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
