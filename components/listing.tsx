"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { FiltersSheet } from "@/components/sections/product-filters";
import type { CategoryLink } from "@/lib/catalog";
import { SORT_OPTIONS } from "@/lib/sort";

const selectClass =
	"cap h-9 max-w-full cursor-pointer appearance-none border-none bg-transparent bg-[length:9px] bg-[right_center] bg-no-repeat pr-5 outline-none focus-visible:underline [background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23191936'/%3E%3C/svg%3E\")]";

/**
 * The original's slim filter bar between two hairlines: category, filters and sort as tracked
 * caps, the piece count beside the sort. Reads the URL, so it sits inside the grid's Suspense.
 */
export function ListingToolbar({
	categories,
	currentCategory,
	facets,
	count,
	sortable = true,
}: {
	categories: CategoryLink[];
	currentCategory?: string;
	facets?: APIProductFiltersResult;
	count: number;
	sortable?: boolean;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const sort = searchParams.get("sort") ?? SORT_OPTIONS[0].value;

	const onSort = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		if (value === SORT_OPTIONS[0].value) params.delete("sort");
		else params.set("sort", value);
		router.push(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
	};

	const showFilters =
		facets &&
		(facets.variantTypes.length > 0 ||
			facets.brands.length > 0 ||
			facets.collections.length > 0 ||
			facets.priceBounds.max > facets.priceBounds.min);

	return (
		<div className="mb-8 flex flex-col gap-y-1 border-y border-line py-2 sm:mb-11 sm:flex-row sm:items-center sm:justify-between sm:gap-x-6 sm:py-3">
			<div className="flex h-9 min-w-0 items-center gap-x-6">
				{categories.length > 0 && (
					<select
						aria-label="Category"
						value={currentCategory ?? ""}
						onChange={(e) => router.push(e.target.value ? `/category/${e.target.value}` : "/products")}
						className={`${selectClass} min-w-0`}
					>
						<option value="">Category: All</option>
						{categories.map((category) => (
							<option key={category.id} value={category.slug}>
								{category.name}
							</option>
						))}
					</select>
				)}
				{showFilters && <FiltersSheet facets={facets} showCategories={false} />}
			</div>
			<div className="flex h-9 items-center justify-between gap-x-6">
				<p className="cap text-faint">
					{count} {count === 1 ? "piece" : "pieces"}
				</p>
				{sortable && (
					<select
						aria-label="Sort"
						value={sort}
						onChange={(e) => onSort(e.target.value)}
						className={selectClass}
					>
						{SORT_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								Sort: {option.label}
							</option>
						))}
					</select>
				)}
			</div>
		</div>
	);
}

/** Same height as the toolbar, so the grid does not jump when it streams in. */
export function ListingToolbarSkeleton() {
	return (
		<div className="mb-8 flex flex-col gap-y-1 border-y border-line py-2 sm:mb-11 sm:flex-row sm:items-center sm:justify-between sm:py-3">
			<div className="flex h-9 items-center">
				<span className="h-3 w-28 animate-pulse bg-tint" />
			</div>
			<div className="flex h-9 items-center justify-between gap-x-6">
				<span className="h-3 w-16 animate-pulse bg-tint" />
				<span className="h-3 w-28 animate-pulse bg-tint" />
			</div>
		</div>
	);
}

export type Crumb = { href?: string; label: string };

/** Breadcrumb in tiny tracked caps over a wide-tracked title, as on the original catalogue. */
export function ListingHeading({
	crumbs,
	title,
	children,
}: {
	crumbs: Crumb[];
	title: string;
	children?: ReactNode;
}) {
	return (
		<div className="mb-8 flex flex-col gap-3 sm:mb-11">
			<nav aria-label="Breadcrumb" className="cap-xs text-faint">
				<Link href="/" className="hover:text-foreground">
					Home
				</Link>
				{crumbs.map((crumb) => (
					<Fragment key={crumb.label}>
						<span aria-hidden> / </span>
						{crumb.href ? (
							<Link href={crumb.href} className="hover:text-foreground">
								{crumb.label}
							</Link>
						) : (
							<span aria-current="page">{crumb.label}</span>
						)}
					</Fragment>
				))}
			</nav>
			<h1 className="text-[24px] font-normal uppercase leading-tight tracking-[0.2em] sm:text-[30px]">
				{title}
			</h1>
			{children}
		</div>
	);
}
