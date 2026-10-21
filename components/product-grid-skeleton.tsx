import { tileGridClass } from "@/components/deckle";
import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="grid content-start gap-0.5" aria-hidden="true">
			<div className="mb-3 aspect-[4/5] animate-pulse rounded-frame bg-stage" />
			<div className="my-[0.2rem] h-5 w-3/4 animate-pulse rounded bg-secondary" />
			<div className="my-[0.1rem] h-4 w-1/3 animate-pulse rounded bg-secondary" />
			<div className="mt-1.5 h-5 w-1/4 animate-pulse rounded bg-secondary" />
		</div>
	);
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
	return (
		<div className={cn(tileGridClass, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
