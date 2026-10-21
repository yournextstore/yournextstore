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

/** Soul's pill sort dropdown. Reads the current sort from the URL (client-side). */
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
					"h-12! w-auto min-w-[11rem] rounded-full border-contrast-100 bg-background px-5 py-3 font-medium text-foreground shadow-none transition-colors hover:border-contrast-300 hover:bg-contrast-100 focus-visible:ring-2 focus-visible:ring-lime [&_svg]:size-5! [&_svg]:text-foreground! [&_svg]:opacity-100",
					className,
				)}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent
				align="end"
				alignItemWithTrigger={false}
				className="rounded-xl border-0 p-2 shadow-xl ring-1 ring-contrast-100"
			>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value} className="rounded-lg py-2 font-medium">
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
