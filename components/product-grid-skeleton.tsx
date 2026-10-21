import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="product" aria-hidden="true">
			<div className="product__img animate-pulse" />
			<div className="product__meta gap-2">
				<div className="h-3 w-1/3 rounded bg-[var(--paper-3)]" />
				<div className="h-5 w-3/4 rounded bg-[var(--paper-3)]" />
				<div className="mt-3 flex items-center justify-between">
					<div className="h-6 w-1/4 rounded bg-[var(--paper-3)]" />
					<div className="h-[38px] w-[38px] rounded-full border border-[var(--line-3)]" />
				</div>
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("shop-grid", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
