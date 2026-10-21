import Link from "next/link";
import { ChevronIcon } from "@/components/icons";
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
	const box =
		"flex size-9 items-center justify-center rounded-md text-sm text-ink transition-colors hover:bg-secondary";

	return (
		<nav aria-label="Pagination" className="my-24 border-t border-black/5 py-4">
			<ul className="flex items-center justify-center gap-4">
				<li className="hidden sm:block">
					{currentPage > 1 ? (
						<Link
							href={buildUrl(basePath, currentPage - 1, filters)}
							aria-label="Previous page"
							className={box}
						>
							<ChevronIcon className="size-4 rotate-90" />
						</Link>
					) : (
						<span className={cn(box, "pointer-events-none opacity-40")} aria-hidden="true">
							<ChevronIcon className="size-4 rotate-90" />
						</span>
					)}
				</li>
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<li key={`ellipsis-${index}`} aria-hidden="true" className="text-sm text-muted-foreground">
							…
						</li>
					) : (
						<li key={page}>
							<Link
								href={buildUrl(basePath, page, filters)}
								aria-label={`Go to page ${page}`}
								aria-current={page === currentPage ? "page" : undefined}
								className={cn(box, page === currentPage && "bg-ink text-white hover:bg-ink")}
							>
								{page}
							</Link>
						</li>
					),
				)}
				<li className="hidden sm:block">
					{currentPage < totalPages ? (
						<Link href={buildUrl(basePath, currentPage + 1, filters)} aria-label="Next page" className={box}>
							<ChevronIcon className="size-4 -rotate-90" />
						</Link>
					) : (
						<span className={cn(box, "pointer-events-none opacity-40")} aria-hidden="true">
							<ChevronIcon className="size-4 -rotate-90" />
						</span>
					)}
				</li>
			</ul>
		</nav>
	);
}
