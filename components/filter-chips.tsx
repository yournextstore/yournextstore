"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { encodeVts, parseVts } from "@/lib/vts";

export type ChipOption = { label: string; value: string };
export type ChipGroup = {
	label: string;
	/** The search param the group sets; `vts:<label>` for a variant type. */
	param: string;
	options: ChipOption[];
	/** The "no choice" chip's words: "All", "Any colour". Omit for a group that always has a choice. */
	all?: string;
	/** The value meaning "nothing chosen", for groups that always have one (sort). */
	fallback?: string;
};

/**
 * Ways to narrow a list, each a row of links: a plain GET, so a choice is an address to share
 * and works before any script loads. On a phone a row scrolls sideways instead of wrapping.
 */
export function FilterChips({ groups, label }: { groups: ChipGroup[]; label: string }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	return <ChipRows groups={groups} label={label} pathname={pathname} searchParams={searchParams} />;
}

/** The rows themselves, for a Suspense fallback too: the same height before the URL is read. */
export function ChipRows({
	groups,
	label,
	pathname,
	searchParams = new URLSearchParams(),
}: {
	groups: ChipGroup[];
	label: string;
	pathname: string;
	searchParams?: Pick<URLSearchParams, "get" | "toString">;
}) {
	const currentOf = (group: ChipGroup) => {
		if (group.param.startsWith("vts:")) {
			return parseVts(searchParams.get("vts"))[group.param.slice(4)]?.[0];
		}
		return searchParams.get(group.param) ?? group.fallback;
	};

	const hrefOf = (group: ChipGroup, value: string | undefined) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		if (group.param.startsWith("vts:")) {
			const record = parseVts(params.get("vts"));
			const encoded = encodeVts({ ...record, [group.param.slice(4)]: value ? [value] : [] });
			if (encoded) params.set("vts", encoded);
			else params.delete("vts");
		} else if (value === undefined || value === group.fallback) {
			params.delete(group.param);
		} else {
			params.set(group.param, value);
		}
		return params.size ? `${pathname}?${params}` : pathname;
	};

	return (
		<nav aria-label={label} className="w-full min-w-0">
			<div className="grid gap-4">
				{groups.map((group, index) => {
					const labelId = `filter-${index}`;
					const current = currentOf(group);
					const options = [
						...(group.all ? [{ label: group.all, value: undefined }] : []),
						...group.options.map((option) => ({ label: option.label, value: option.value })),
					];
					return (
						<div
							key={group.param}
							className="grid min-w-0 gap-2 lg:grid-cols-[6.5rem_minmax(0,1fr)] lg:items-center"
						>
							<span id={labelId} className="text-[0.8125rem] font-semibold text-muted-foreground">
								{group.label}
							</span>
							<ul
								aria-labelledby={labelId}
								className="relative flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] lg:flex-wrap lg:overflow-x-visible"
							>
								{options.map((option) => {
									const isCurrent = option.value === current;
									return (
										<li key={option.value ?? "all"} className="shrink-0">
											<Link
												href={hrefOf(group, option.value)}
												scroll={false}
												aria-current={isCurrent ? "true" : undefined}
												className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full bg-secondary px-3.5 text-sm font-semibold transition-colors hover:shadow-[inset_0_0_0_1px_var(--input)] aria-[current=true]:bg-primary aria-[current=true]:text-primary-foreground aria-[current=true]:hover:bg-primary-hover"
											>
												{option.label}
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					);
				})}
			</div>
		</nav>
	);
}
