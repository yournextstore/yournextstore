"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SortOption = { value: string; label: string };

type SortSelectProps = {
	options: readonly SortOption[];
	filters: Record<string, string | undefined>;
	className?: string;
};

/** Compact sort dropdown for small screens (the inline links are used on desktop). */
export function SortSelect({ options, filters, className }: SortSelectProps) {
	const router = useRouter();
	const current = filters.sort ?? options[0]?.value;

	const onChange = (value: string) => {
		// Preserve active filters when changing sort; reset to the first page.
		const params = new URLSearchParams();
		for (const [key, val] of Object.entries(filters)) {
			if (val && key !== "sort" && key !== "page") {
				params.set(key, val);
			}
		}
		if (value !== options[0]?.value) {
			params.set("sort", value);
		}
		router.push(params.size ? `/products?${params}` : "/products", { scroll: false });
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
