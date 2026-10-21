import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="text-center">
			<div className="py-[22px] mb-5">
				<div className="aspect-[285/336] animate-pulse bg-eerie-4" />
			</div>
			<div className="mx-auto mb-2 h-3 w-1/3 animate-pulse bg-eerie-4" />
			<div className="mx-auto h-6 w-2/3 animate-pulse bg-eerie-4" />
			<div className="mx-auto mt-3 h-5 w-1/4 animate-pulse bg-eerie-4" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
