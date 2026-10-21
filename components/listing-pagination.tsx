import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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

/** Numbered pagination in the original's round buttons. Carries every active filter across page links. */
export function ListingPagination({
	basePath,
	currentPage,
	totalPages,
	filters = {},
}: {
	basePath: string;
	currentPage: number;
	totalPages: number;
	filters?: Record<string, string | undefined>;
}) {
	if (totalPages <= 1) return null;

	const pageNumbers = getPageNumbers(currentPage, totalPages);

	return (
		<nav className="pagination" aria-label="Pagination">
			{currentPage > 1 && (
				<Link
					className="button icon"
					href={buildUrl(basePath, currentPage - 1, filters)}
					aria-label="Previous page"
				>
					<ChevronLeft size={16} aria-hidden />
				</Link>
			)}
			{pageNumbers.map((page, index) =>
				page === "ellipsis" ? (
					<span key={`ellipsis-${index}`} className="pagination-gap" aria-hidden>
						…
					</span>
				) : (
					<Link
						key={page}
						className="button icon"
						href={buildUrl(basePath, page, filters)}
						aria-current={page === currentPage ? "page" : undefined}
						aria-label={`Page ${page}`}
					>
						{page}
					</Link>
				),
			)}
			{currentPage < totalPages && (
				<Link
					className="button icon"
					href={buildUrl(basePath, currentPage + 1, filters)}
					aria-label="Next page"
				>
					<ChevronRight size={16} aria-hidden />
				</Link>
			)}
		</nav>
	);
}
