"use client";

import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { YnsLink } from "@/components/yns-link";
import { cn } from "@/lib/utils";

type SortOption = { value: string; label: string };

// Build a sort href that preserves every active filter and resets to the first page.
function buildSortHref(
	searchParams: ReadonlyURLSearchParams,
	pathname: string,
	value: string,
	defaultValue: string,
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
					<YnsLink
						key={option.value}
						prefetch="eager"
						href={buildSortHref(searchParams, pathname, option.value, defaultValue)}
						className={cn(
							"text-sm transition-colors",
							isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
						)}
					>
						{option.label}
					</YnsLink>
				);
			})}
		</>
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
