import { ArrowLeft, ArrowRight } from "lucide-react";
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

/** Numbered pagination for product listing pages. Carries every active filter across page links. */
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
	const edge =
		"inline-flex h-9 items-center gap-2 rounded-lg border border-black/10 px-3 text-sm font-medium transition-colors hover:bg-pill";

	// The original's row: bordered Previous at the start, page numbers centred, bordered Next at the end.
	return (
		<nav
			aria-label="Pagination"
			className="flex items-center justify-between gap-2 border-t border-black/10 pt-5"
		>
			{currentPage > 1 ? (
				<Link href={buildUrl(basePath, currentPage - 1, filters)} className={edge} aria-label="Previous page">
					<ArrowLeft className="size-4" aria-hidden />
					<span className="hidden sm:inline">Previous</span>
				</Link>
			) : (
				<span className={cn(edge, "pointer-events-none opacity-40")} aria-hidden>
					<ArrowLeft className="size-4" />
					<span className="hidden sm:inline">Previous</span>
				</span>
			)}
			<ul className="flex items-center gap-0.5">
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<li
							key={`ellipsis-${index}`}
							className="px-2 text-sm font-medium text-muted-foreground"
							aria-hidden
						>
							…
						</li>
					) : (
						<li key={page}>
							<Link
								href={buildUrl(basePath, page, filters)}
								aria-current={page === currentPage ? "page" : undefined}
								className={cn(
									"flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
									page === currentPage ? "bg-pill text-black" : "text-muted-foreground hover:text-black",
								)}
							>
								{page}
							</Link>
						</li>
					),
				)}
			</ul>
			{currentPage < totalPages ? (
				<Link href={buildUrl(basePath, currentPage + 1, filters)} className={edge} aria-label="Next page">
					<span className="hidden sm:inline">Next</span>
					<ArrowRight className="size-4" aria-hidden />
				</Link>
			) : (
				<span className={cn(edge, "pointer-events-none opacity-40")} aria-hidden>
					<span className="hidden sm:inline">Next</span>
					<ArrowRight className="size-4" />
				</span>
			)}
		</nav>
	);
}
