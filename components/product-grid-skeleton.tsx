import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			<div className="aspect-[5/6] animate-pulse rounded-xl bg-contrast-100 md:rounded-2xl" />
			<div className="mt-2 space-y-1.5 px-1 sm:mt-0">
				<div className="h-5 w-3/4 animate-pulse rounded bg-contrast-100" />
				<div className="h-5 w-1/4 animate-pulse rounded bg-contrast-100" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 gap-x-4 gap-y-6 xs:grid-cols-2 md:grid-cols-3 md:gap-x-5 md:gap-y-8 xl:grid-cols-4",
				className,
			)}
		>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
