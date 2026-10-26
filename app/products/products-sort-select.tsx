"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toSearchParams } from "@/lib/listing-routes";
import { cn } from "@/lib/utils";

type SortOption = { value: string; label: string };

// Build a sort href that preserves every active filter and resets to the first page.
function buildSortHref(
	searchParams: URLSearchParams,
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

/** The active sort comes from the server (`active`), like the filters (lib/listing-routes.ts). */
export function SortLinks({
	options,
	active,
}: {
	options: readonly SortOption[];
	active: Record<string, string | undefined>;
}) {
	const searchParams = toSearchParams(active);
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

/** Compact sort dropdown for small screens. The active sort comes from the server (`active`), like `SortLinks`. */
export function SortSelect({
	options,
	className,
	active,
}: {
	options: readonly SortOption[];
	className?: string;
	active: Record<string, string | undefined>;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = toSearchParams(active);
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;

	const onChange = (value: string | null) => {
		if (value === null) {
			return;
		}
		router.push(buildSortHref(searchParams, pathname, value, defaultValue), { scroll: false });
	};

	return (
		<Select value={current} onValueChange={onChange} items={options}>
			<SelectTrigger size="sm" className={cn("w-auto min-w-[9rem]", className)} aria-label="Sort products">
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
	);
}
