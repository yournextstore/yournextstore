import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The original's collection header: the Belleza title on the left, the "Filter" pill on the right. */
export function ListingHeader({
	title,
	description,
	filters,
	centered = false,
}: {
	title: string;
	description?: string | null;
	filters?: ReactNode;
	centered?: boolean;
}) {
	if (centered) {
		return (
			<div className="pt-8 md:pt-10">
				<nav aria-label="Breadcrumb" className="text-center text-[13px] text-muted-foreground">
					<Link href="/" className="hover:text-foreground">
						Home
					</Link>
					<span className="mx-2">/</span>
					<span aria-current="page">{title}</span>
				</nav>
				<h1 className="mt-3 text-center text-h4">{title}</h1>
				{filters && <div className="mt-6 flex justify-end">{filters}</div>}
			</div>
		);
	}
	return (
		<div className="flex items-start justify-between gap-4 pt-8 md:pt-10">
			<div className="min-w-0">
				<h1 className="text-h4 wrap-break-word">{title}</h1>
				{description && <p className="mt-2 max-w-2xl text-[13px] text-muted-foreground">{description}</p>}
			</div>
			{filters && <div className="shrink-0">{filters}</div>}
		</div>
	);
}

/** "Products (8)" on the left, "Sort by: Featured" on the right. */
export function ListingToolbar({ count, sort }: { count: number; sort?: ReactNode }) {
	return (
		<div className="flex h-14 items-center justify-between gap-3">
			<p className="text-[13px]">Products ({count})</p>
			{sort}
		</div>
	);
}

/** Two across on phones, three on tablets, four on desktop, as the original. */
export const listingGridClass = "grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-3 lg:grid-cols-4 md:gap-y-10";

export function ListingBody({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("pt-4 pb-20 md:pb-28", className)}>{children}</div>;
}

export function ListingEmpty({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-[40svh] flex-col items-center justify-center gap-3 py-16 text-center">
			<p className="font-serif text-2xl">Nothing here yet</p>
			<p className="text-[15px] text-muted-foreground">{children}</p>
		</div>
	);
}

/** Same footprint as the toolbar and the first row of cards, so the streamed list does not shift. */
export function ListingSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div aria-hidden="true" className="min-h-svh">
			<div className="h-14" />
			<div className={cn(listingGridClass, "pt-4")}>
				{Array.from({ length: count }, (_, i) => (
					<div key={i}>
						<div className="aspect-square animate-pulse rounded-lg bg-stage" />
						<div className="mt-4 h-[7.5rem]" />
					</div>
				))}
			</div>
		</div>
	);
}

/** Outlined "Filter" pill's footprint while the filter sheet (which reads the URL) streams in. */
export function FilterButtonFallback() {
	return <div aria-hidden="true" className="h-11 w-[6.5rem] rounded-[16px] border border-line" />;
}
