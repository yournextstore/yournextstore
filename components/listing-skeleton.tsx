import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

/** Toolbar (Filter + Sort pills) and grid at their real heights, so the listing lands without a shift. */
export function ListingSkeleton({ withFilter = true }: { withFilter?: boolean }) {
	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center gap-2">
				{withFilter ? <div className="h-8 w-16 animate-pulse rounded-md bg-secondary" /> : null}
				<div className="h-8 w-20 animate-pulse rounded-md bg-secondary" />
			</div>
			<ProductGridSkeleton />
		</section>
	);
}
