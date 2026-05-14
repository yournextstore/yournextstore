import { ArrowLeft, ArrowRight } from "lucide-react";
import { YnsLink } from "@/components/yns-link";

function buildSearchUrl({
	query,
	page,
	sort,
	category,
}: {
	query: string;
	page: number;
	sort?: string;
	category?: string;
}) {
	const params = new URLSearchParams({ q: query });
	if (page > 1) params.set("page", String(page));
	if (sort && sort !== "newest") params.set("sort", sort);
	if (category) params.set("category", category);
	return `/search?${params.toString()}`;
}

export function SearchPagination({
	currentPage,
	totalPages,
	query,
	sort,
	category,
}: {
	currentPage: number;
	totalPages: number;
	query: string;
	sort?: string;
	category?: string;
}) {
	if (totalPages <= 1) return null;
	const prevHref = currentPage > 1 ? buildSearchUrl({ query, page: currentPage - 1, sort, category }) : null;
	const nextHref =
		currentPage < totalPages ? buildSearchUrl({ query, page: currentPage + 1, sort, category }) : null;

	return (
		<nav
			aria-label="Search results pagination"
			className="mt-20 flex items-center justify-between border-t border-border pt-8"
		>
			{prevHref ? (
				<YnsLink
					href={prevHref}
					className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
					rel="prev"
				>
					<ArrowLeft
						className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
						strokeWidth={1.5}
					/>
					Previous
				</YnsLink>
			) : (
				<span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/40">Previous</span>
			)}

			<span className="text-sm tabular-nums text-muted-foreground">
				<span className="font-medium text-foreground">{currentPage}</span> / {totalPages}
			</span>

			{nextHref ? (
				<YnsLink
					href={nextHref}
					className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
					rel="next"
				>
					Next
					<ArrowRight
						className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
						strokeWidth={1.5}
					/>
				</YnsLink>
			) : (
				<span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/40">Next</span>
			)}
		</nav>
	);
}
