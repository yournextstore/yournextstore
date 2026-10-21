"use client";

import { LayoutGridIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SortOption = { value: string; label: string };

// Build a sort href that preserves every active filter and resets to the first page.
function buildSortHref(
	searchParams: ReadonlyURLSearchParams,
	pathname: string,
	value: string,
	defaultValue: string | undefined,
): string {
	const params = new URLSearchParams(searchParams.toString());
	// Any sort change keeps the result set but reorders it — return to the first page.
	params.delete("page");
	if (value === defaultValue) {
		params.delete("sort");
	} else {
		params.set("sort", value);
	}
	return params.size ? `${pathname}?${params}` : pathname;
}

/** The original's "Sort By" select. Reads the current sort from the URL (client-side). */
export function SortSelect({ options, className }: { options: readonly SortOption[]; className?: string }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;

	const onChange = (value: string) => {
		router.push(buildSortHref(searchParams, pathname, value, defaultValue), { scroll: false });
	};

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<span className="hidden text-sm font-semibold text-ink sm:inline">Sort By</span>
			<Select value={current} onValueChange={onChange}>
				<SelectTrigger
					size="sm"
					className="w-auto rounded-md border-border text-xs font-semibold text-ink shadow-none sm:min-w-[9rem]"
					aria-label="Sort products"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="end">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

/** The original's grid / list "Views" switch, kept in the URL so the server renders the layout. */
export function ViewToggle() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const current = searchParams.get("view") === "list" ? "list" : "grid";
	const hrefFor = (view: "grid" | "list") => {
		const params = new URLSearchParams(searchParams.toString());
		if (view === "grid") params.delete("view");
		else params.set("view", "list");
		return params.size ? `${pathname}?${params}` : pathname;
	};
	const views = [
		{ value: "grid" as const, label: "Grid view", Icon: LayoutGridIcon },
		{ value: "list" as const, label: "List view", Icon: ListIcon },
	];

	return (
		<div className="flex items-center gap-2">
			<span className="hidden text-sm font-semibold text-ink lg:inline">Views</span>
			{views.map(({ value, label, Icon }) => (
				<Link
					key={value}
					href={hrefFor(value)}
					scroll={false}
					aria-label={label}
					aria-current={current === value ? "true" : undefined}
					className={cn(
						"flex size-7 items-center justify-center rounded-md border border-ink transition-colors",
						current === value ? "bg-ink text-background" : "text-ink hover:bg-light",
					)}
				>
					<Icon aria-hidden className="size-3.5" strokeWidth={2.5} />
				</Link>
			))}
		</div>
	);
}

/** Same footprint as the toolbar, for the Suspense fallback (no search-param hooks here). */
export function ToolbarSkeleton() {
	return (
		<div className="mb-6 flex h-8 items-center justify-between gap-3">
			<div className="flex items-center gap-2">
				<span className="hidden text-sm font-semibold text-ink lg:inline">Views</span>
				<span className="size-7 rounded-md border border-ink bg-ink" />
				<span className="size-7 rounded-md border border-ink" />
			</div>
			<div className="h-8 w-36 rounded-md border border-border" />
		</div>
	);
}
