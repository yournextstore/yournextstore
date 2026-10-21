import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ actions = false }: { actions?: boolean }) {
	return (
		<div>
			<div className="h-48 w-full animate-pulse bg-secondary" />
			<div className="mt-2 h-7 w-3/4 animate-pulse rounded bg-secondary" />
			<div className="h-7 w-1/4 animate-pulse rounded bg-secondary" />
			{actions && <div className="mt-4 mb-8 h-[4.75rem] animate-pulse rounded-md bg-secondary sm:h-9" />}
		</div>
	);
}

export function ProductGridSkeleton({
	count = 6,
	className,
	actions = false,
}: {
	count?: number;
	className?: string;
	actions?: boolean;
}) {
	return (
		<div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} actions={actions} />
			))}
		</div>
	);
}
