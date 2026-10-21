import Link from "next/link";
import type { ReactNode } from "react";
import type { CatalogEntry } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** Sidebar card + results card, as on the template's category page. */
export function ListingShell({
	sidebar,
	toolbar,
	children,
}: {
	sidebar?: ReactNode;
	toolbar?: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="uk-container pb-10 lg:pb-[70px]">
			<div className={cn("grid grid-cols-1 gap-10", sidebar && "lg:grid-cols-[270px_minmax(0,1fr)]")}>
				{sidebar && (
					<aside aria-label="Catalog filters" className="hidden lg:block">
						<div className="uk-card overflow-hidden">{sidebar}</div>
					</aside>
				)}
				<div className="uk-card min-w-0 overflow-hidden">
					{toolbar && (
						<div className="flex min-h-[48px] flex-wrap items-center justify-center gap-x-5 gap-y-[10px] border-b border-border px-5 py-[12px] sm:justify-between">
							{toolbar}
						</div>
					)}
					{children}
				</div>
			</div>
		</div>
	);
}

export function CatalogNav({
	entries,
	activeHref,
	title,
}: {
	entries: CatalogEntry[];
	activeHref?: string;
	title: string;
}) {
	return (
		<nav aria-label={title} className="p-5">
			<h2 className="mb-[10px] text-uk-lg">{title}</h2>
			<ul>
				<li>
					<Link
						href="/products"
						aria-current={activeHref === "/products" ? "page" : undefined}
						className={cn(
							"block py-[5px] text-uk-sm transition-colors hover:text-foreground",
							activeHref === "/products" ? "text-foreground" : "text-muted-foreground",
						)}
					>
						All products
					</Link>
				</li>
				{entries.map((entry) => (
					<li key={entry.href}>
						<Link
							href={entry.href}
							aria-current={activeHref === entry.href ? "page" : undefined}
							className={cn(
								"block py-[5px] text-uk-sm transition-colors hover:text-foreground",
								activeHref === entry.href ? "text-foreground" : "text-muted-foreground",
							)}
						>
							{entry.name}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

/** Static stand-in for the sort/filters row while it streams (same box, no search-param reads). */
export function ToolbarFallback({ withFilters = false }: { withFilters?: boolean }) {
	return (
		<>
			<div className="h-6 w-64 max-w-full rounded-[2px] bg-muted" />
			{withFilters && <div className="h-8 w-[92px] rounded-[4px] border border-border lg:hidden" />}
		</>
	);
}

export function EmptyResults({ children }: { children: ReactNode }) {
	return <div className="px-5 py-[70px] text-center text-uk-md text-muted-foreground">{children}</div>;
}
