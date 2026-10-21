import { cn } from "@/lib/utils";

/** Grid columns for results inside the listing card (narrower than the home grid). */
export const LISTING_CELLS = "rounded-none shadow-none lg:grid-cols-2 xl:grid-cols-3";

export function ProductCardSkeleton() {
	return (
		<div className="grid h-full grid-cols-[40%_minmax(0,1fr)] gap-x-[15px] bg-card p-[15px] sm:flex sm:flex-col sm:p-5">
			<div className="aspect-square animate-pulse rounded-[4px] bg-muted sm:mb-5 sm:aspect-[5/4]" />
			<div className="space-y-[10px]">
				<div className="h-4 w-1/3 animate-pulse rounded-[2px] bg-muted" />
				<div className="h-5 w-3/4 animate-pulse rounded-[2px] bg-muted" />
				<div className="mt-[30px] h-7 w-1/3 animate-pulse rounded-[2px] bg-muted" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<ul
			className={cn(
				"uk-card grid grid-cols-1 overflow-hidden sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				className,
			)}
		>
			{Array.from({ length: count }).map((_, i) => (
				<li key={`skeleton-${i}`} className="shadow-[1px_0_0_var(--border),0_1px_0_var(--border)]">
					<ProductCardSkeleton />
				</li>
			))}
		</ul>
	);
}
