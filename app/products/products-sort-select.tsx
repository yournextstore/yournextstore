"use client";

import { ArrowDownWideNarrow } from "lucide-react";
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

/**
 * Sort dropdown. `inline` is the desktop toolbar control ("SORT BY" + select); `bar` fills one
 * half of the phone's fixed Sort / Filter bar, as in the original.
 */
export function SortSelect({
	options,
	className,
	variant = "inline",
}: {
	options: readonly SortOption[];
	className?: string;
	variant?: "inline" | "bar";
}) {
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

	if (variant === "bar") {
		return (
			<Select value={current} onValueChange={onChange} items={options}>
				<SelectTrigger
					aria-label="Sort products"
					className={cn(
						"h-14 w-full justify-center gap-2.5 rounded-none border-0 bg-transparent shadow-none [&>svg:last-child]:hidden",
						className,
					)}
				>
					<ArrowDownWideNarrow className="size-4 text-foreground" aria-hidden />
					<span className="flex flex-col items-start leading-tight">
						<span className="text-sm font-semibold text-foreground">Sort by</span>
						<span className="text-xs text-muted-foreground">
							<SelectValue />
						</span>
					</span>
				</SelectTrigger>
				<SelectContent align="center">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	}

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<span className="ed-label hidden text-muted-foreground sm:inline">Sort by</span>
			<Select value={current} onValueChange={onChange} items={options}>
				<SelectTrigger className="h-9 min-w-[10rem] bg-background" aria-label="Sort products">
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
