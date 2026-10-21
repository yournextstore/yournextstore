"use client";

import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SortOption = { value: string; label: string };

function buildSortHref(
	searchParams: ReadonlyURLSearchParams,
	pathname: string,
	value: string,
	defaultValue: string | undefined,
) {
	const params = new URLSearchParams(searchParams.toString());
	params.delete("page");
	if (value === defaultValue) {
		params.delete("sort");
	} else {
		params.set("sort", value);
	}
	return params.size ? `${pathname}?${params}` : pathname;
}

/** "Sort · Newest" pill. Reads the current sort from the URL (client-side). */
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
				aria-label="Sort products"
				className={cn(
					"h-10! w-auto min-w-[150px] rounded-full border-line bg-transparent px-4 text-sm shadow-none hover:border-foreground dark:bg-transparent",
					className,
				)}
			>
				<span className="text-muted-foreground">Sort ·</span>
				<SelectValue />
			</SelectTrigger>
			<SelectContent align="end" className="rounded-[20px] border-line bg-panel">
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value} className="rounded-full">
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
