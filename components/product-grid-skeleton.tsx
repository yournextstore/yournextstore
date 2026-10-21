import { CARD_GRID } from "@/components/product-card";
import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="animate-pulse overflow-hidden rounded-lg border bg-card shadow-sm">
			<div className="h-60 w-full bg-muted" />
			<div className="space-y-2.5 p-4">
				<div className="h-4 w-1/2 rounded-full bg-muted" />
				<div className="h-2.5 rounded-full bg-muted" />
				<div className="h-2.5 w-4/5 rounded-full bg-muted" />
				<div className="h-2.5 w-3/5 rounded-full bg-muted" />
			</div>
			<div className="px-6 pb-6">
				<div className="h-5 w-16 rounded-full bg-muted" />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(CARD_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
