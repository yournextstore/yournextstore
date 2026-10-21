"use client";

import { ArrowUpDown } from "lucide-react";
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
			<SelectTrigger
				className={cn(
					"w-auto gap-2 rounded-lg border-0 data-[size=default]:h-10 bg-transparent px-2.5 text-base shadow-none hover:bg-secondary focus-visible:ring-2 dark:bg-transparent [&>svg:last-child]:hidden",
					className,
				)}
				aria-label="Sort products"
			>
				<ArrowUpDown aria-hidden="true" className="size-4 opacity-80" />
				<span className="text-foreground">Sort by:</span>
				<span className="font-semibold text-foreground">
					<SelectValue />
				</span>
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
