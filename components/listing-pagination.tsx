import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

function buildUrl(basePath: string, page: number, filters: Record<string, string | undefined> = {}) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(filters)) {
		if (value && key !== "page") params.set(key, value);
	}
	if (page > 1) params.set("page", String(page));
	return params.size ? `${basePath}?${params}` : basePath;
}

const itemClass = "inline-flex h-10 items-center gap-1 rounded-md px-4 text-sm font-medium";

/** The original's quiet Previous / Next pager. Carries every active filter across page links. */
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

	return (
		<nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
			{currentPage > 1 ? (
				<Link
					href={buildUrl(basePath, currentPage - 1, filters)}
					rel="prev"
					className={`${itemClass} transition-colors hover:bg-accent`}
				>
					<ChevronLeftIcon className="size-4" />
					Previous
				</Link>
			) : (
				<span aria-disabled className={`${itemClass} text-muted-foreground`}>
					<ChevronLeftIcon className="size-4" />
					Previous
				</span>
			)}
			<span className="px-2 text-sm text-muted-foreground tabular-nums">
				{currentPage} / {totalPages}
			</span>
			{currentPage < totalPages ? (
				<Link
					href={buildUrl(basePath, currentPage + 1, filters)}
					rel="next"
					className={`${itemClass} transition-colors hover:bg-accent`}
				>
					Next
					<ChevronRightIcon className="size-4" />
				</Link>
			) : (
				<span aria-disabled className={`${itemClass} text-muted-foreground`}>
					Next
					<ChevronRightIcon className="size-4" />
				</span>
			)}
		</nav>
	);
}
