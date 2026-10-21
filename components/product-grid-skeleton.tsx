import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div>
			<div className="mx-auto aspect-[0.7] animate-pulse bg-photon-wash max-[480px]:aspect-[0.8] max-[480px]:w-[90%]" />
			<div className="mt-[var(--main-padding)] h-4 w-2/3 bg-photon-wash" />
			<div className="h-4 w-1/5 bg-photon-wash" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("photon-grid", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
