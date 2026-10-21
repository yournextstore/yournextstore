import Link from "next/link";

function getPageNumbers(currentPage: number, totalPages: number) {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	return pages.reduce<(number | "ellipsis")[]>((acc, page) => {
		if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
			acc.push(page);
			return acc;
		}
		if (acc[acc.length - 1] !== "ellipsis") acc.push("ellipsis");
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

/** Mono pagination on a hairline. Carries every active filter across page links. */
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
		<nav
			aria-label="Pagination"
			className="mono mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-[0.6875rem] uppercase tracking-[0.05em]"
		>
			{currentPage > 1 ? (
				<Link href={buildUrl(basePath, currentPage - 1, filters)} className="link text-muted-foreground">
					Previous
				</Link>
			) : (
				<span />
			)}
			<ul className="flex items-center gap-1">
				{getPageNumbers(currentPage, totalPages).map((page, index) =>
					page === "ellipsis" ? (
						<li key={`ellipsis-${index}`} className="px-2 text-muted-foreground" aria-hidden="true">
							…
						</li>
					) : (
						<li key={page}>
							<Link
								href={buildUrl(basePath, page, filters)}
								aria-current={page === currentPage ? "page" : undefined}
								className="chip min-w-8 justify-center px-2"
							>
								{String(page).padStart(2, "0")}
							</Link>
						</li>
					),
				)}
			</ul>
			{currentPage < totalPages ? (
				<Link href={buildUrl(basePath, currentPage + 1, filters)} className="link text-muted-foreground">
					Next
				</Link>
			) : (
				<span />
			)}
		</nav>
	);
}
