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

/** The sort order as one comma-separated line of text links, the original's only control style. */
export function SortLinks({ options }: { options: readonly SortOption[] }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;

	return (
		<p className="text-sm md:text-base">
			<span className="text-muted-foreground">Sort by </span>
			{options.map((option, index) => {
				const isActive = option.value === current;
				return (
					<span key={option.value}>
						{index ? ", " : ""}
						<Link
							href={buildSortHref(searchParams, pathname, option.value, defaultValue)}
							aria-current={isActive ? "true" : undefined}
							className={cn(
								"inline-flex min-h-6 items-center",
								isActive ? "italic underline underline-offset-4" : "hover:italic",
							)}
						>
							{option.label}
						</Link>
					</span>
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
