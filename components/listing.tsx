import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The thin breadcrumb strip under the header on listing pages: HOME / PRODUCTS. */
export function BreadcrumbBar({ items }: { items: { label: string; href?: string }[] }) {
	return (
		<nav aria-label="Breadcrumb" className="border-b border-border">
			<ol className="shell flex h-14 items-center gap-2 overflow-hidden text-xs uppercase">
				{items.map((item, index) => (
					<Fragment key={`${item.label}-${index}`}>
						{index > 0 && (
							<li aria-hidden="true" className="text-muted-foreground">
								/
							</li>
						)}
						<li className="min-w-0 truncate">
							{item.href ? (
								<Link href={item.href} className="text-foreground hover:underline">
									{item.label}
								</Link>
							) : (
								<span aria-current="page" className="text-muted-foreground">
									{item.label}
								</span>
							)}
						</li>
					</Fragment>
				))}
			</ol>
		</nav>
	);
}

/** Centred two-line title: a soft lead word over an underlined name, then a small-caps line. */
export function ListingTitle({ lead, title, subtitle }: { lead: string; title: string; subtitle?: string }) {
	return (
		<header className="shell py-14 text-center sm:py-20">
			<h1 className="text-4xl leading-[1.05] font-medium sm:text-5xl">
				<span className="block text-muted-foreground">{lead}</span>
				<span className="block underline decoration-2 underline-offset-[0.12em]">{title}</span>
			</h1>
			{subtitle && <p className="mx-auto mt-5 max-w-xl text-sm/6 uppercase text-foreground">{subtitle}</p>}
		</header>
	);
}

/** Toolbar row above the grid: count and sort on the left, filters on the right. */
export function ListingToolbar({
	count,
	sort,
	filters,
}: {
	count: number;
	sort?: ReactNode;
	filters?: ReactNode;
}) {
	return (
		<div className="flex min-h-[3.25rem] items-center justify-between gap-2 border-b border-border pb-4">
			<div className="flex min-w-0 items-center gap-2 text-sm/6 whitespace-nowrap uppercase text-muted-foreground sm:gap-3">
				<span>
					{count} {count === 1 ? "product" : "products"}
				</span>
				{sort && (
					<>
						<span aria-hidden="true">/</span>
						{sort}
					</>
				)}
			</div>
			{filters}
		</div>
	);
}

export const listingGridClass = "grid grid-cols-1 gap-x-5 gap-y-10 pt-10 sm:grid-cols-2 lg:grid-cols-4";

/** Same footprint as the toolbar and a row of cards, so the streamed list does not shift the page. */
export function ListingSkeleton({ count = 4, toolbar = true }: { count?: number; toolbar?: boolean }) {
	return (
		<div aria-hidden="true">
			{toolbar && <div className="h-[3.25rem] border-b border-border" />}
			<div className={cn(listingGridClass)}>
				{Array.from({ length: count }, (_, i) => (
					<div key={i} className="animate-pulse bg-tile">
						<div className="aspect-[3/4]" />
						<div className="h-[6.75rem]" />
					</div>
				))}
			</div>
		</div>
	);
}
