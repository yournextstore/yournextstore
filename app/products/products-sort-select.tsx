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

/** "Sort by" dropdown of the listing toolbar. Reads the current sort from the URL (client-side). */
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
		<div className="flex items-center gap-1">
			<span aria-hidden="true" className="text-[13px] tracking-[0.02em] uppercase">
				Sort by:
			</span>
			<Select value={current} onValueChange={onChange}>
				<SelectTrigger
					size="sm"
					className={cn(
						"h-9 gap-1 border-0 bg-transparent px-1 text-[13px] font-semibold tracking-[0.02em] text-foreground uppercase shadow-none focus-visible:ring-1 dark:bg-transparent",
						className,
					)}
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
