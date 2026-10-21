import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Breadcrumb strip under the header: "Home / Collections / Women", last item in ink. */
export function BreadcrumbBar({
	items,
	className,
}: {
	items: { label: string; href?: string }[];
	className?: string;
}) {
	return (
		<nav aria-label="Breadcrumb" className={cn("bg-surface", className)}>
			<ol className="shell flex h-14 items-center gap-2 overflow-hidden text-sm">
				{items.map((item, index) => (
					<Fragment key={`${item.label}-${index}`}>
						{index > 0 && (
							<li aria-hidden="true" className="text-muted-foreground">
								/
							</li>
						)}
						<li className="min-w-0 truncate">
							{item.href ? (
								<Link
									href={item.href}
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									{item.label}
								</Link>
							) : (
								<span aria-current="page" className="text-foreground">
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

/** Collection banner: a darkened photograph with the centred serif title and a one-line intro. */
export function ListingHero({
	title,
	subtitle,
	image,
}: {
	title: string;
	subtitle?: string;
	image?: string | null;
}) {
	return (
		<header className="relative flex h-[260px] items-center justify-center overflow-hidden bg-ink sm:h-[340px] lg:h-[400px]">
			{image && (
				<YNSMedia src={image} alt="" fill priority sizes="100vw" className="object-cover object-[50%_30%]" />
			)}
			<div className="absolute inset-0 bg-black/45" />
			<div className="shell relative z-10 text-center text-on-ink">
				<h1 className="text-5xl leading-tight wrap-break-word md:text-6xl">{title}</h1>
				{subtitle && <p className="mx-auto mt-3 max-w-2xl text-base text-on-ink/90 md:text-xl">{subtitle}</p>}
			</div>
		</header>
	);
}

/** Count on the left, "Sort by:" on the right, a hairline below. */
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
		<div className="flex min-h-[4.5rem] flex-wrap items-center justify-between gap-3 border-b border-border py-4">
			<p className="text-sm text-muted-foreground">
				{count} {count === 1 ? "product" : "products"}
			</p>
			<div className="flex items-center gap-2">
				{filters && <div className="lg:hidden">{filters}</div>}
				{sort}
			</div>
		</div>
	);
}

export const listingGridClass = "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4";

/** Sidebar + grid frame: the original keeps "Filters" in a left column on desktop. */
export function ListingBody({ sidebar, children }: { sidebar?: ReactNode; children: ReactNode }) {
	return (
		<div className="grid gap-8 pt-8 pb-20 md:pt-12 lg:grid-cols-[17rem_1fr] lg:gap-12">
			{sidebar ? <div className="hidden lg:block">{sidebar}</div> : <div className="hidden lg:block" />}
			<div className={cn(!sidebar && "lg:col-span-2")}>{children}</div>
		</div>
	);
}

/** Same footprint as the toolbar and the first row of cards, so the streamed list does not shift. */
export function ListingSkeleton({ count = 8 }: { count?: number }) {
	return (
		<div aria-hidden="true" className="min-h-svh">
			<div className="min-h-[4.5rem] border-b border-border" />
			<div className="grid gap-8 pt-8 md:pt-12 lg:grid-cols-[17rem_1fr] lg:gap-12">
				<div className="hidden lg:block">
					<div className="h-8 w-28 animate-pulse rounded bg-secondary" />
				</div>
				<div className={listingGridClass}>
					{Array.from({ length: count }, (_, i) => (
						<div key={i}>
							<div className="aspect-[3/4] animate-pulse rounded-lg bg-secondary" />
							<div className="mt-4 h-[4.75rem]" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
