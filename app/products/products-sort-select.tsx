"use client";

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

/** Inline sort links for desktop. Reads the current sort from the URL (client-side). */
export function SortLinks({ options }: { options: readonly SortOption[] }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;

	return (
		<>
			{options.map((option) => {
				const isActive = option.value === current;
				return (
					<Link
						key={option.value}
						href={buildSortHref(searchParams, pathname, option.value, defaultValue)}
						className={cn(
							"text-sm transition-colors",
							isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
						)}
					>
						{option.label}
					</Link>
				);
			})}
		</>
	);
}

/** "Sort by" label plus a bordered select, as on the original toolbar. Reads the current sort from the URL. */
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
		<div className={cn("flex items-center gap-2", className)}>
			<span className="hidden text-sm text-muted-foreground sm:inline">Sort by</span>
			<Select value={current} onValueChange={onChange}>
				<SelectTrigger
					aria-label="Sort products"
					className="h-10 w-[172px] rounded-md border-border bg-background data-[size=default]:h-10"
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
