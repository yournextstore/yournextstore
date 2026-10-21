import type { ReactNode } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

/** The filter column scrolls inside one viewport, so it can never outgrow its streaming fallback. */
export const SIDEBAR =
	"self-start lg:sticky lg:top-4 lg:max-h-[calc(100svh-2rem)] lg:overflow-y-auto lg:rounded-lg [scrollbar-width:thin]";

/** White toolbar strip above the grid: page title on the left, filter/sort controls on the right. */
export function ListingToolbar({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children?: ReactNode;
}) {
	return (
		<div className="mb-4 flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-lg bg-card px-4 py-2.5">
			<div className="min-w-0">
				<h1 className="text-lg font-semibold text-neutral-900 [overflow-wrap:anywhere]">{title}</h1>
				{description && <p className="text-xs text-muted-foreground">{description}</p>}
			</div>
			<div className="flex items-center gap-2">{children}</div>
		</div>
	);
}

/** Same boxes as the real listing (sidebar, toolbar, grid) so nothing shifts when it streams in. */
export function ListingFallback({ filtersAvailable, title }: { filtersAvailable: boolean; title: string }) {
	return (
		<div className={filtersAvailable ? "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-5" : ""}>
			{filtersAvailable && <div className="hidden h-[calc(100svh-2rem)] rounded-lg bg-card lg:block" />}
			<div>
				<ListingToolbar title={title}>
					{filtersAvailable && <div className="h-9 w-24 rounded-lg border border-border bg-card lg:hidden" />}
					<div className="h-8 w-36 rounded-md border border-border bg-card" />
				</ListingToolbar>
				<ProductGridSkeleton />
			</div>
		</div>
	);
}
