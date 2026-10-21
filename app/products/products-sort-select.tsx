"use client";

import Link from "next/link";
import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment } from "react";
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

/** Comma-separated sort links, the current one in italics like the header's current page. */
export function SortLinks({ options }: { options: readonly SortOption[] }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;

	return (
		<p>
			{options.map((option, index) => {
				const isActive = option.value === current;
				return (
					<Fragment key={option.value}>
						<Link
							href={buildSortHref(searchParams, pathname, option.value, defaultValue)}
							scroll={false}
							aria-current={isActive ? "true" : undefined}
							className={cn("tap hover:underline", isActive && "italic")}
						>
							{option.label}
						</Link>
						{index < options.length - 1 && ", "}
					</Fragment>
				);
			})}
		</p>
	);
}

/** Compact sort dropdown for small screens. Reads the current sort from the URL (client-side). */
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
		<Select value={current} onValueChange={onChange}>
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

/** The same line before the URL is known (Suspense fallback): identical text, nothing marked. */
export function SortLinksFallback({ options }: { options: readonly SortOption[] }) {
	return (
		<p>
			{options.map((option, index) => (
				<Fragment key={option.value}>
					<span className="tap">{option.label}</span>
					{index < options.length - 1 && ", "}
				</Fragment>
			))}
		</p>
	);
}
