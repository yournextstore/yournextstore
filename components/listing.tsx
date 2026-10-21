import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The original's listing frame: a 215px filter rail with a hairline on its right, then the title
 * row ("All Products  68 items" … "SORT BY [select]"), a rule, and the grid.
 */
export function ListingFrame({
	sidebar,
	children,
	crumbs,
}: {
	sidebar?: ReactNode;
	children: ReactNode;
	crumbs?: ReactNode;
}) {
	return (
		<div className="page-width min-h-svh pb-16">
			{crumbs}
			<div className={cn(sidebar && "lg:grid lg:grid-cols-[215px_minmax(0,1fr)]")}>
				{sidebar && (
					<aside className="hidden pt-4 pr-4 lg:block lg:border-r lg:border-border" aria-label="Filters">
						{sidebar}
					</aside>
				)}
				<div className={cn("min-w-0 pt-4", sidebar && "lg:pl-6")}>{children}</div>
			</div>
		</div>
	);
}

export function ListingHeader({
	title,
	count,
	controls,
}: {
	title: string;
	count: ReactNode;
	controls?: ReactNode;
}) {
	return (
		<div className="flex min-h-12 items-center justify-between gap-4 border-b border-border pb-3">
			<h1 className="ed-display m-0 flex min-w-0 flex-wrap items-baseline gap-x-2 text-display-page">
				<span className="wrap-break-word">{title}</span>
				<span className="font-sans text-xs font-medium tracking-normal text-muted-foreground">{count}</span>
			</h1>
			{controls && <div className="hidden shrink-0 lg:block">{controls}</div>}
		</div>
	);
}

export function itemCount(count: number) {
	return `${count} ${count === 1 ? "item" : "items"}`;
}

/** Phones and tablets: Sort and Filter as two halves of a bar fixed to the bottom edge. */
export function ListingBar({ children }: { children: ReactNode }) {
	return (
		<div
			data-listing-bar
			className="fixed inset-x-0 bottom-0 z-40 grid auto-cols-fr grid-flow-col divide-x divide-border border-t border-border bg-background lg:hidden"
		>
			{children}
		</div>
	);
}

export function ListingPageCaption({ page, pages }: { page: number; pages: number }) {
	if (pages <= 1) return null;
	return (
		<p className="ed-label mt-5 text-center text-muted-foreground">
			Showing page {page} of {pages}
		</p>
	);
}

/** Static stand-ins for the toolbar controls, the same size as the real ones (no layout shift). */
export function ControlsSkeleton() {
	return (
		<div className="flex items-center gap-3">
			<span className="ed-label text-muted-foreground">Sort by</span>
			<span className="block h-9 w-40 rounded-md border border-input" />
		</div>
	);
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
	return (
		<ul className="m-0 mt-5 grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0 md:grid-cols-3 xl:grid-cols-4 wide:grid-cols-5">
			{Array.from({ length: count }, (_, i) => (
				<li key={`s-${i}`}>
					<div className="aspect-[3/4] animate-pulse rounded-lg bg-muted" />
					<div className="mt-2 h-[2.2em] w-3/4 animate-pulse rounded bg-muted" />
					<div className="mt-1 h-4 w-1/3 animate-pulse rounded bg-muted" />
				</li>
			))}
		</ul>
	);
}
