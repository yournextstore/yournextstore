import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The original's product listing: breadcrumbs, a sticky left column with the title, its result
 * count and the facets, the sort control above a 2/3-column grid, and a sticky title bar with a
 * Filters button on small screens.
 */
export function ListingLayout({
	title,
	count,
	crumbs,
	filters,
	mobileFilters,
	sort,
	intro,
	children,
}: {
	title: string;
	count: number;
	crumbs: Crumb[];
	filters?: ReactNode;
	mobileFilters?: ReactNode;
	sort?: ReactNode;
	intro?: ReactNode;
	children: ReactNode;
}) {
	return (
		// min-h-svh like the skeleton: a short result list must not pull the footer up when it lands.
		<div className="mx-auto min-h-svh w-full md:max-w-shop">
			<div className="p-4 md:pt-8 xl:px-0">
				<Breadcrumbs items={crumbs} />
			</div>
			<div className="sticky top-[81px] z-40 flex items-center justify-between gap-4 bg-white/80 p-4 backdrop-blur-lg lg:hidden">
				<div className="flex min-w-0 items-baseline gap-1 text-2xl font-semibold tracking-tight">
					<h1 className="truncate">{title}</h1>
					<span className="text-xl">({count})</span>
				</div>
				{mobileFilters}
			</div>
			{intro}
			<div className="flex gap-12 p-4 xl:px-0">
				<div className="sticky top-[100px] hidden max-h-[90dvh] w-full max-w-64 shrink-0 self-start lg:block">
					<div className="flex items-start gap-1 font-semibold tracking-tight">
						<h1 className="pb-4 text-3xl text-balance break-words lg:text-4xl">{title}</h1>
						<span className="text-2xl">({count})</span>
					</div>
					{filters && <div className="no-scrollbar max-h-[70dvh] overflow-y-auto">{filters}</div>}
				</div>
				<div className="w-full min-w-0 pb-12">
					<div className="flex min-h-9 justify-end pb-4">{sort}</div>
					{children}
				</div>
			</div>
		</div>
	);
}

export function ListingGrid({ children }: { children: ReactNode }) {
	return (
		<div className="grid w-full grid-cols-2 items-start gap-2 gap-y-4 sm:grid-cols-3 sm:gap-4">
			{children}
		</div>
	);
}

/** Same frame as ListingLayout, so the streamed page lands without shifting. */
export function ListingSkeleton() {
	return (
		<div className="mx-auto min-h-svh w-full md:max-w-shop">
			<div className="p-4 md:pt-8 xl:px-0">
				<Skeleton className="h-5 w-40" />
			</div>
			<div className="flex h-[68px] items-center p-4 lg:hidden">
				<Skeleton className="h-8 w-48" />
			</div>
			<div className="flex gap-12 p-4 xl:px-0">
				<div className="hidden w-full max-w-64 shrink-0 space-y-4 lg:block">
					<Skeleton className="h-10 w-40" />
					<Skeleton className="h-64 w-full" />
				</div>
				<div className="w-full min-w-0">
					<div className="flex min-h-9 justify-end pb-4">
						<Skeleton className="h-9 w-24" />
					</div>
					<ProductGridSkeleton />
				</div>
			</div>
		</div>
	);
}
