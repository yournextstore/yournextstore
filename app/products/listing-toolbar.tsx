"use client";

import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type FacetOption, sortOptions } from "@/lib/sort";
import { cn } from "@/lib/utils";

const FILTER_KEYS = ["category", "collection", "brand", "priceMin", "priceMax", "vts"] as const;

const trigger =
	"inline-flex h-[52px] min-w-[9.5rem] items-center justify-between gap-s rounded-lg lg:min-w-[11.375rem] border border-brand bg-transparent px-s text-b-sm leading-[1.5] transition-colors hover:bg-blush data-[state=open]:bg-blush";

const menu = "min-w-[14rem] rounded-lg border-brand bg-background p-1 text-foreground shadow-none";
const item = "rounded-md py-2 pl-8 text-b-md focus:bg-blush focus:text-foreground";

type Group = { key: "collection" | "category"; label: string; options: FacetOption[] };

/**
 * The original's refinement row: outlined Collections / Categories dropdowns and a "Clear all"
 * link on desktop, one "Filter" dropdown on phones; Sort sits at the inline end.
 */
export function ListingToolbar({
	collections = [],
	categories = [],
}: {
	collections?: FacetOption[];
	categories?: FacetOption[];
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const groups: Group[] = [
		...(collections.length > 0
			? [{ key: "collection" as const, label: "Collections", options: collections }]
			: []),
		...(categories.length > 0
			? [{ key: "category" as const, label: "Categories", options: categories }]
			: []),
	];

	const hrefWith = (key: string, value: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		if (value) params.set(key, value);
		else params.delete(key);
		return params.size ? `${pathname}?${params}` : pathname;
	};
	const go = (key: string, value: string | null) => router.push(hrefWith(key, value), { scroll: false });

	const activeFilters = FILTER_KEYS.some((key) => searchParams.has(key));
	const clearHref = (() => {
		const params = new URLSearchParams(searchParams.toString());
		for (const key of [...FILTER_KEYS, "page"]) params.delete(key);
		return params.size ? `${pathname}?${params}` : pathname;
	})();
	const currentSort = searchParams.get("sort") ?? sortOptions[0].value;
	const sortLabel = sortOptions.find((option) => option.value === currentSort)?.label ?? "Sort";

	const radioGroup = (group: Group) => (
		<DropdownMenuRadioGroup
			value={searchParams.get(group.key) ?? ""}
			onValueChange={(value) => go(group.key, value || null)}
		>
			<DropdownMenuRadioItem value="" className={item}>
				All
			</DropdownMenuRadioItem>
			{group.options.map((option) => (
				<DropdownMenuRadioItem key={option.slug} value={option.slug} className={item}>
					{option.name}
				</DropdownMenuRadioItem>
			))}
		</DropdownMenuRadioGroup>
	);

	return (
		<div className="flex flex-wrap items-center justify-between gap-s">
			<div className="flex items-center gap-s">
				{groups.length > 0 && (
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger className={cn(trigger, "lg:hidden")}>
							Filter
							<ChevronDownIcon aria-hidden="true" className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className={menu}>
							{groups.map((group, index) => (
								<div key={group.key}>
									{index > 0 && <DropdownMenuSeparator className="bg-brand/40" />}
									<DropdownMenuLabel className="text-b-xs uppercase tracking-[0.48px]">
										{group.label}
									</DropdownMenuLabel>
									{radioGroup(group)}
								</div>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
				{groups.map((group) => {
					const active = group.options.find((option) => option.slug === searchParams.get(group.key));
					return (
						<DropdownMenu key={group.key} modal={false}>
							<DropdownMenuTrigger className={cn(trigger, "hidden lg:inline-flex")}>
								{active ? active.name : group.label}
								<ChevronDownIcon aria-hidden="true" className="size-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className={menu}>
								{radioGroup(group)}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				})}
				{activeFilters && (
					<Link href={clearHref} scroll={false} className="text-b-xs underline underline-offset-2">
						Clear all
					</Link>
				)}
			</div>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger className={trigger}>
					<span>
						<span className="sr-only">Sort: </span>
						{sortLabel}
					</span>
					<ChevronDownIcon aria-hidden="true" className="size-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className={menu}>
					<DropdownMenuRadioGroup
						value={currentSort}
						onValueChange={(value) => go("sort", value === sortOptions[0].value ? null : value)}
					>
						{sortOptions.map((option) => (
							<DropdownMenuRadioItem key={option.value} value={option.value} className={item}>
								{option.label}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

/** Same footprint as the toolbar, for the Suspense fallback (no layout shift when it lands). */
export function ListingToolbarSkeleton() {
	return (
		<div className="flex flex-wrap items-center justify-between gap-s">
			<div className="h-[52px] w-[9.5rem] rounded-lg border border-brand/40 lg:w-[11.375rem]" />
			<div className="h-[52px] w-[9.5rem] rounded-lg border border-brand/40 lg:w-[11.375rem]" />
		</div>
	);
}
