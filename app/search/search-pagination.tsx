import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { SearchFilters } from "./search-filters";

function buildSearchUrl({
	query,
	page,
	sort,
	filters,
}: {
	query: string;
	page: number;
	sort?: string;
	filters: SearchFilters;
}) {
	const params = new URLSearchParams({ q: query });
	if (page > 1) params.set("page", String(page));
	if (sort && sort !== "newest") params.set("sort", sort);
	for (const [key, value] of Object.entries(filters)) {
		if (value) params.set(key, value);
	}
	return `/search?${params.toString()}`;
}

export function SearchPagination({
	currentPage,
	totalPages,
	query,
	sort,
	filters,
}: {
	currentPage: number;
	totalPages: number;
	query: string;
	sort?: string;
	filters: SearchFilters;
}) {
	if (totalPages <= 1) return null;
	const prevHref = currentPage > 1 ? buildSearchUrl({ query, page: currentPage - 1, sort, filters }) : null;
	const nextHref =
		currentPage < totalPages ? buildSearchUrl({ query, page: currentPage + 1, sort, filters }) : null;

	return (
		<nav
			aria-label="Search results pagination"
			className="mt-20 flex items-center justify-between border-t border-border pt-8"
		>
			{prevHref ? (
				<Link
					href={prevHref}
					className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
					rel="prev"
				>
					<ArrowLeft
						className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
						strokeWidth={1.5}
					/>
					Previous
				</Link>
			) : (
				<span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/40">Previous</span>
			)}

			<span className="text-sm tabular-nums text-muted-foreground">
				<span className="font-medium text-foreground">{currentPage}</span> / {totalPages}
			</span>

			{nextHref ? (
				<Link
					href={nextHref}
					className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
					rel="next"
				>
					Next
					<ArrowRight
						className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
						strokeWidth={1.5}
					/>
				</Link>
			) : (
				<span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/40">Next</span>
			)}
		</nav>
	);
}
