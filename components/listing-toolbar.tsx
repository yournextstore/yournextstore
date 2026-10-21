"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type FacetControl, sortOptions, TOOLBAR_GRID } from "@/lib/sort";

const ALL = "__all";

/** The original's filter row: full-width outline selects that rewrite the query string. */
export function ListingToolbar({ facets }: { facets: FacetControl[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const update = (param: string, value: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		if (value === null) {
			params.delete(param);
		} else {
			params.set(param, value);
		}
		router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
	};

	const sort = searchParams.get("sort") ?? sortOptions[0].value;

	return (
		<div className={TOOLBAR_GRID}>
			<Select
				value={sort}
				onValueChange={(value) => update("sort", value === sortOptions[0].value ? null : value)}
			>
				<SelectTrigger className="w-full" aria-label="Sort products">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent>
					{sortOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{facets.map((facet) => (
				<Select
					key={facet.param}
					value={searchParams.get(facet.param) ?? ALL}
					onValueChange={(value) => update(facet.param, value === ALL ? null : value)}
				>
					<SelectTrigger className="w-full" aria-label={facet.placeholder}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{facet.placeholder}</SelectItem>
						{facet.options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			))}
		</div>
	);
}

/** Same boxes, no search params: the Suspense fallback for the row above. */
export function ListingToolbarSkeleton({ count }: { count: number }) {
	return (
		<div className={TOOLBAR_GRID} aria-hidden>
			{Array.from({ length: count + 1 }).map((_, i) => (
				<div key={i} className="h-9 w-full rounded-md border border-input shadow-xs" />
			))}
		</div>
	);
}
