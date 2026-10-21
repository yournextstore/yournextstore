"use client";

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

/**
 * Solace sort control: a tonal "Sort" pill on phones, "Sort by:" and a square 200px select from
 * 640px. Reads the current sort from the URL (client-side).
 */
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
		<div className={cn("flex w-full items-center gap-4 sm:w-auto", className)}>
			<span className="hidden text-copy text-muted-foreground sm:block" aria-hidden="true">
				Sort by:
			</span>
			<Select value={current} onValueChange={onChange}>
				<SelectTrigger
					className="h-12! w-full rounded-3xl border-0 bg-tonal px-4 text-copy text-foreground shadow-none sm:w-[12.5rem] sm:rounded-none sm:border sm:border-border sm:bg-background sm:px-3 [&_svg:not([class*='text-'])]:text-foreground"
					aria-label="Sort products"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="end" className="rounded-none border-foreground">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value} className="rounded-none text-copy">
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
