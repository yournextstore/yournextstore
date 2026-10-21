import Link from "next/link";
import type { ReactNode } from "react";
import { sentenceCase } from "@/lib/display";
import { sortOptions } from "@/lib/sort-options";
import { cn } from "@/lib/utils";

type Params = Record<string, string | undefined>;

function hrefWith(basePath: string, params: Params, changes: Params) {
	const next = new URLSearchParams();
	for (const [key, value] of Object.entries({ ...params, ...changes })) {
		if (value && key !== "page") next.set(key, value);
	}
	return next.size ? `${basePath}?${next}` : basePath;
}

/**
 * The original's listing sidebar: sort links on top, then ruled disclosure groups. Rendered
 * on the server from the resolved search params; the Suspense fallback renders it with
 * `params` null (nothing active) so the column keeps its exact height while results load.
 */
export function ListingSidebar({
	basePath,
	params,
	categories,
	activeCategory,
	filters,
}: {
	basePath: string;
	params: Params | null;
	categories: { name: string; slug: string }[];
	activeCategory?: string;
	filters?: ReactNode;
}) {
	const currentSort = params?.sort ?? sortOptions[0].value;
	return (
		<aside aria-label="Sort and browse" className="text-center lg:text-left">
			<ul className="space-y-1.5 text-sm">
				{sortOptions.map((option) => {
					const active = params !== null && currentSort === option.value;
					return (
						<li key={option.value}>
							<Link
								href={hrefWith(basePath, params ?? {}, {
									sort: option.value === sortOptions[0].value ? undefined : option.value,
								})}
								aria-current={active ? "true" : undefined}
								className={cn(
									"inline-block py-1 font-medium transition-colors",
									active ? "font-bold text-ink" : "text-gray-700 hover:text-ink",
								)}
							>
								{option.label}
							</Link>
						</li>
					);
				})}
			</ul>
			{categories.length > 0 && (
				<details className="group mt-6 border-y border-border py-5" open={Boolean(activeCategory)}>
					<summary className="flex cursor-pointer list-none items-center justify-center gap-2 text-sm font-medium text-gray-900 lg:justify-between [&::-webkit-details-marker]:hidden">
						Categories
						<span aria-hidden className="text-subtle transition-transform group-open:rotate-45">
							+
						</span>
					</summary>
					<ul className="mt-4 space-y-3 text-sm">
						{categories.map((category) => (
							<li key={category.slug}>
								<Link
									href={`/category/${category.slug}`}
									aria-current={activeCategory === category.slug ? "page" : undefined}
									className={cn(
										"transition-colors",
										activeCategory === category.slug
											? "font-semibold text-ink"
											: "text-muted-foreground hover:text-ink",
									)}
								>
									{sentenceCase(category.name)}
								</Link>
							</li>
						))}
					</ul>
				</details>
			)}
			<div className="mt-5 flex justify-center lg:justify-start">
				{filters ?? <div aria-hidden className="h-11 w-full rounded border border-border sm:w-28" />}
			</div>
		</aside>
	);
}

/** Sidebar column beside a four-fifths results column, the original's `grid-cols-5` listing. */
export function ListingLayout({
	sidebar,
	children,
	className,
}: {
	sidebar: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("mx-auto min-h-svh max-w-7xl bg-white pb-16 pt-8 lg:grid lg:grid-cols-5", className)}>
			<div className="col-span-1 p-4 lg:ml-4">{sidebar}</div>
			<div className="col-span-4 mt-6 px-8 sm:px-6 lg:mt-0 lg:px-8">{children}</div>
		</div>
	);
}
