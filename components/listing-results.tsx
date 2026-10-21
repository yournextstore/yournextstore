import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

/** "6 products": an h2 so the card titles (h3) keep a valid heading order under the page h1. */
export function ResultCount({ count }: { count: number }) {
	return (
		<h2 className="py-4 text-[11px] font-normal uppercase tracking-[0.14em] text-muted-foreground">
			{count} {count === 1 ? "product" : "products"}
		</h2>
	);
}

export function NothingFound() {
	return (
		<div className="py-24 text-center">
			<p className="mb-3 font-display text-3xl italic text-muted-foreground">Nothing found</p>
			<p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
		</div>
	);
}

export function ListingGridFallback() {
	return (
		<>
			<div className="py-4">
				<div className="h-[16.5px] w-24 animate-pulse rounded bg-secondary" />
			</div>
			<ProductGridSkeleton />
		</>
	);
}
