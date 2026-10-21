import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("flex flex-col gap-y-2 rounded shadow-sm", className)}>
			<div className="rounded border-2 border-shelf bg-shelf p-4 sm:p-8 md:p-4 lg:p-8">
				<div className="mx-auto h-44 aspect-[2/3] animate-pulse rounded bg-rule" />
			</div>
			<div className="space-y-2 px-4 pb-4">
				<div className="h-10 pt-1">
					<div className="h-4 w-3/4 animate-pulse rounded bg-shelf" />
				</div>
				<div className="h-6 w-1/3 animate-pulse rounded bg-shelf" />
				<div className="h-9 w-full animate-pulse rounded bg-shelf" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 10, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("shelf-grid", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
