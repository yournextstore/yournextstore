import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function getPageNumbers(currentPage: number, totalPages: number) {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	return pages.reduce<(number | "ellipsis")[]>((acc, page) => {
		if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
			acc.push(page);
			return acc;
		}
		const last = acc[acc.length - 1];
		if (last !== "ellipsis") {
			acc.push("ellipsis");
		}
		return acc;
	}, []);
}

function buildUrl(basePath: string, page: number, filters: Record<string, string | undefined> = {}) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(filters)) {
		if (value && key !== "page") params.set(key, value);
	}
	if (page > 1) params.set("page", String(page));
	return params.size ? `${basePath}?${params}` : basePath;
}

const BOX =
	"flex size-8 items-center justify-center border border-border text-sm transition-colors first:rounded-l last:rounded-r -ml-px first:ml-0";

/** The original's pager: "Showing 1 to 12 of 49 results" beside a row of joined square boxes. */
export function ListingPagination({
	basePath,
	currentPage,
	totalPages,
	totalCount,
	perPage,
	filters = {},
}: {
	basePath: string;
	currentPage: number;
	totalPages: number;
	totalCount?: number;
	perPage?: number;
	filters?: Record<string, string | undefined>;
}) {
	const showing =
		totalCount !== undefined && perPage !== undefined && totalCount > 0 ? (
			<p className="text-sm text-gray-700">
				Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to{" "}
				<span className="font-medium">{Math.min(currentPage * perPage, totalCount)}</span> of{" "}
				<span className="font-medium">{totalCount}</span> results
			</p>
		) : null;
	if (totalPages <= 1) {
		return showing ? <div className="mt-10 flex justify-end">{showing}</div> : null;
	}

	const pageNumbers = getPageNumbers(currentPage, totalPages);

	return (
		<nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-end gap-4">
			{showing}
			<ul className="flex">
				{currentPage > 1 && (
					<li className="contents">
						<Link
							href={buildUrl(basePath, currentPage - 1, filters)}
							aria-label="Previous page"
							className={cn(BOX, "text-gray-500 hover:bg-gray-50")}
						>
							<ChevronLeft className="size-4" aria-hidden />
						</Link>
					</li>
				)}
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<li key={`ellipsis-${index}`} className={cn(BOX, "text-gray-500")} aria-hidden>
							…
						</li>
					) : (
						<li key={page} className="contents">
							<Link
								href={buildUrl(basePath, page, filters)}
								aria-current={page === currentPage ? "page" : undefined}
								className={cn(
									BOX,
									page === currentPage
										? "relative z-10 border-sky bg-sky font-semibold text-ink"
										: "text-gray-900 hover:bg-gray-50",
								)}
							>
								{page}
							</Link>
						</li>
					),
				)}
				{currentPage < totalPages && (
					<li className="contents">
						<Link
							href={buildUrl(basePath, currentPage + 1, filters)}
							aria-label="Next page"
							className={cn(BOX, "text-gray-500 hover:bg-gray-50")}
						>
							<ChevronRight className="size-4" aria-hidden />
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}
