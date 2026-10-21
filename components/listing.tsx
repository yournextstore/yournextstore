import type { ReactNode } from "react";
import { CARD_GRID, ProductCardSkeleton } from "@/components/product-grid-skeleton";
import { cn } from "@/lib/utils";

/**
 * The shop-grid page the original kit's paid edition is known for, rebuilt in the free kit's
 * vocabulary: a filter column on the left (lg+), a grey title panel, a count/sort toolbar and
 * the product cards.
 */
export function ListingShell({
	crumbs,
	sidebar,
	title,
	children,
}: {
	crumbs: ReactNode;
	sidebar?: ReactNode;
	title: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="fc-container min-h-svh">
			{crumbs}
			<div className="mt-8 mb-14 flex flex-col gap-8 lg:flex-row lg:gap-10">
				{sidebar ? <div className="hidden shrink-0 lg:block lg:w-1/4">{sidebar}</div> : null}
				<section className="min-w-0 flex-1">
					{title}
					{children}
				</section>
			</div>
		</div>
	);
}

/** The grey panel that carries the page title (and a line of copy) above the grid. */
export function TitlePanel({ title, text }: { title: string; text?: string | null }) {
	return (
		<div className="mb-4 rounded-lg bg-gray-100 p-6 sm:p-8">
			<h1 className="text-fc-xl break-words sm:text-fc-2xl">{title}</h1>
			{text ? <p className="mt-2 max-w-2xl">{text}</p> : null}
		</div>
	);
}

/** Count on the left, controls on the right; wraps under the count on narrow screens. */
export function ListingToolbar({ count, children }: { count: number; children?: ReactNode }) {
	return (
		<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
			<p>
				<span className="text-gray-900">{count}</span> {count === 1 ? "product" : "products"} found
			</p>
			<div className="flex items-center gap-2">{children}</div>
		</div>
	);
}

export function ListingGrid({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<>
			<h2 className="sr-only">Products</h2>
			<div className={cn(CARD_GRID, className)}>{children}</div>
		</>
	);
}

/** Same boxes as the toolbar and a page of cards, so the streamed list lands without shifting. */
export function ListingSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<div className="h-[21px] w-32 animate-pulse rounded bg-gray-100" />
				<div className="h-8 w-40 animate-pulse rounded-md border border-gray-300" />
			</div>
			<div className={cn(CARD_GRID, className)}>
				{Array.from({ length: count }).map((_, i) => (
					<ProductCardSkeleton key={`skeleton-${i}`} />
				))}
			</div>
		</div>
	);
}

export function EmptyListing({ text = "No products match these filters." }: { text?: string }) {
	return (
		<div className="fc-card items-center px-6 py-16 text-center">
			<p className="text-fc-md text-gray-800">{text}</p>
		</div>
	);
}
