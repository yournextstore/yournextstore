import type { ReactNode } from "react";
import { GridToggle } from "@/components/listing-client";
import { cn } from "@/lib/utils";

/**
 * The original's collection header: the uppercase Tenor title on the left; the large/compact
 * grid switch and the outlined FILTER button on the right (under the title on phones).
 */
export function ListingHeader({
	title,
	description,
	filters,
}: {
	title: string;
	description?: string | null;
	filters?: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-6 pt-10 md:flex-row md:items-start md:justify-between md:pt-12">
			<div className="min-w-0">
				<h1 className="text-h3 wrap-break-word uppercase">{title}</h1>
				{description && <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">{description}</p>}
			</div>
			<div className="flex shrink-0 items-center justify-between gap-3 md:justify-end">
				<GridToggle />
				{filters}
			</div>
		</div>
	);
}

/** "PRODUCTS (8)" on the left, "SORT BY: …" on the right. */
export function ListingToolbar({ count, sort }: { count: number; sort?: ReactNode }) {
	return (
		<div className="flex h-14 items-center justify-between gap-3 md:mt-2">
			<p className="text-[13px] tracking-[0.02em] uppercase">Products ({count})</p>
			{sort}
		</div>
	);
}

/**
 * Large cards by default (one per row on phones, two on desktop, as the original opens); the
 * header switch flips `data-grid` on <html> to the compact two/three/four-column grid.
 */
export const listingGridClass =
	"listing-grid grid grid-cols-1 gap-x-2.5 gap-y-8 sm:grid-cols-2 md:gap-x-2.5 md:gap-y-10";

export function ListingBody({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("pt-4 pb-20 md:pb-28", className)}>{children}</div>;
}

export function ListingEmpty({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-[40svh] flex-col items-center justify-center gap-3 py-16 text-center">
			<p className="font-serif text-2xl uppercase">Nothing here yet</p>
			<p className="text-[15px] text-muted-foreground">{children}</p>
		</div>
	);
}

/** Same footprint as the toolbar and the first row of cards, so the streamed list does not shift. */
export function ListingSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div aria-hidden="true" className="min-h-svh">
			<div className="h-14 md:mt-2" />
			<div className={cn(listingGridClass, "pt-4")}>
				{Array.from({ length: count }, (_, i) => (
					<div key={i}>
						<div className="aspect-square animate-pulse rounded-md bg-stage" />
						<div className="mt-3 h-16" />
					</div>
				))}
			</div>
		</div>
	);
}

/** Outlined "FILTER" button's footprint while the filter sheet (which reads the URL) streams in. */
export function FilterButtonFallback() {
	return <div aria-hidden="true" className="h-12 w-[6.75rem] rounded-xs border border-input" />;
}
