import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="text-center">
			<div className="aspect-[448/470] animate-pulse bg-gainsboro" />
			<div className="mt-[30px] flex flex-col items-center gap-2.5">
				<div className="h-[30px] w-3/4 animate-pulse bg-gainsboro" />
				<div className="h-6 w-1/4 animate-pulse bg-gainsboro" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-x-6 gap-y-[60px] md:grid-cols-2 sp-xl:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
