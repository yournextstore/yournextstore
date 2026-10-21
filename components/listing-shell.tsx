import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ProductCardSkeleton } from "@/components/product-grid-skeleton";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export type Crumb = { href?: string; label: string };

/** The rule under the header and the original's "Home > Shop" trail. */
export function PageTrail({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
	return (
		<>
			<hr className="mb-5 border-black/10 sm:mb-6" />
			<Breadcrumb className={cn("mb-5 sm:mb-9", className)}>
				<BreadcrumbList className="text-muted-foreground">
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
					</BreadcrumbItem>
					{crumbs.map((crumb) => (
						<Fragment key={crumb.label}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{crumb.href ? (
									<BreadcrumbLink
										render={<Link href={crumb.href} />}
										className="capitalize-first inline-block"
									>
										{crumb.label}
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage className="capitalize-first inline-block text-black">
										{crumb.label}
									</BreadcrumbPage>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</>
	);
}

export const listingGridClass =
	"grid w-full grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-5";

/** Title row of the shop page: title (and the phone filter button), then "Showing …" and the sort. */
export function ListingToolbar({
	title,
	filtersButton,
	range,
	sort,
}: {
	title: string;
	filtersButton?: ReactNode;
	range: { from: number; to: number; total: number } | null;
	sort?: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
			<div className="flex items-center justify-between gap-3">
				<h1 className="capitalize-first text-2xl font-bold md:text-[32px] md:leading-tight">{title}</h1>
				{filtersButton}
			</div>
			<div className="flex min-h-8 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
				{range && (
					<span className="text-sm text-muted-foreground md:text-base">
						{range.total === 0
							? "No products"
							: `Showing ${range.from}-${range.to} of ${range.total} ${range.total === 1 ? "Product" : "Products"}`}
					</span>
				)}
				{sort}
			</div>
		</div>
	);
}

/** Same footprint as the real listing (sidebar card, toolbar, grid) so streaming it in does not shift the page. */
export function ListingSkeleton({ title, sidebar = true }: { title: string; sidebar?: boolean }) {
	return (
		<div className="flex min-h-svh items-start md:gap-5">
			{sidebar && (
				<div className="hidden h-[640px] w-[295px] shrink-0 rounded-[20px] border border-black/10 md:block" />
			)}
			<div className="flex w-full flex-col gap-5">
				<ListingToolbar
					title={title}
					range={null}
					filtersButton={sidebar ? <span className="size-8 shrink-0 rounded-full bg-pill md:hidden" /> : null}
					sort={<span className="h-8 w-44" />}
				/>
				<div className={listingGridClass}>
					{Array.from({ length: 6 }, (_, i) => (
						<ProductCardSkeleton key={`skeleton-${i}`} />
					))}
				</div>
			</div>
		</div>
	);
}
