"use client";

import { ChevronDownIcon } from "lucide-react";
import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

/** The original's "Sort ▾" pill: an outline button opening a radio menu. Reads the sort from the URL. */
export function SortSelect({ options, className }: { options: readonly SortOption[]; className?: string }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;
	const currentLabel = options.find((option) => option.value === current)?.label;

	const onChange = (value: string | null) => {
		if (value === null) {
			return;
		}
		router.push(buildSortHref(searchParams, pathname, value, defaultValue), { scroll: false });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className={cn("group/sort text-xs font-medium", className)}
						aria-label={currentLabel ? `Sort: ${currentLabel}` : "Sort"}
					/>
				}
			>
				Sort
				<ChevronDownIcon
					className="size-4 transition-transform group-aria-expanded/sort:rotate-180"
					aria-hidden
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-48">
				<DropdownMenuRadioGroup value={current} onValueChange={onChange}>
					{options.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value}>
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
