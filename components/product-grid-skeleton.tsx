import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ variant = "listing" }: { variant?: "home" | "listing" }) {
	return (
		<div className="animate-pulse">
			<div
				className={cn("bg-secondary", variant === "home" ? "aspect-4/5 rounded-lg" : "aspect-3/4 rounded-xl")}
			/>
			<div className="mt-3 space-y-2">
				<div className="h-3.5 w-4/5 rounded bg-secondary" />
				<div className="h-4 w-2/5 rounded bg-secondary" />
			</div>
		</div>
	);
}

export const CARD_GRID = "grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-7 lg:grid-cols-4";

export function ProductGridSkeleton({
	count = 8,
	className,
	variant = "listing",
}: {
	count?: number;
	className?: string;
	variant?: "home" | "listing";
}) {
	return (
		<div className={cn(CARD_GRID, className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} variant={variant} />
			))}
		</div>
	);
}
