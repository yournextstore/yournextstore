import Link from "next/link";
import type { ReactNode } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { cn } from "@/lib/utils";

export const listingGridClass = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

/** The original's listing head: tiny breadcrumb trail, then the uppercase category name. */
export function ListingHeader({
	crumbs,
	title,
	children,
}: {
	crumbs: { href?: string; label: string }[];
	title: string;
	children?: ReactNode;
}) {
	return (
		<div className="mb-6">
			<nav aria-label="Breadcrumb" className="mb-2">
				<ol className="flex flex-wrap items-center gap-x-2 text-label-sm">
					{crumbs.map((crumb, index) => (
						<li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
							{index > 0 && (
								<span aria-hidden className="text-muted-foreground">
									/
								</span>
							)}
							{crumb.href ? (
								<Link href={crumb.href} className="hover:underline">
									{crumb.label}
								</Link>
							) : (
								<span aria-current="page">{crumb.label}</span>
							)}
						</li>
					))}
				</ol>
			</nav>
			<h1 className="text-title font-medium uppercase md:text-display">{title}</h1>
			{children}
		</div>
	);
}

/** Same box as the listing body (sidebar, toolbar, count, grid), so the swap doesn't shift. */
export function ListingSkeleton({ sidebar = true }: { sidebar?: boolean }) {
	return (
		<div className={cn(sidebar && "lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-4")}>
			{sidebar && (
				<div className="hidden space-y-2.5 lg:block">
					<div className="h-5" />
					{Array.from({ length: 3 }).map((_, index) => (
						<div key={index} className="h-[46px] rounded-sm border border-border" />
					))}
				</div>
			)}
			<div>
				<div className="mb-4 h-10" />
				<div className="mb-4 h-[22px] w-24 animate-pulse rounded-xs bg-secondary" />
				<ProductGridSkeleton className={listingGridClass} />
			</div>
		</div>
	);
}
