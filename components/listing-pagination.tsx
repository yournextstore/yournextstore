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

/**
 * The original's dotted pagination band: page pills on the textured strip. Carries every active
 * filter across page links.
 */
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
		<nav
			aria-label="Pagination"
			className="hull-dots relative border-t border-border p-4 text-center md:py-8"
		>
			<ul className="flex flex-wrap items-center justify-center gap-2">
				{currentPage > 1 && (
					<li>
						<Link href={buildUrl(basePath, currentPage - 1, filters)} className="hull-btn hull-btn-large">
							Previous
						</Link>
					</li>
				)}
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<li key={`ellipsis-${index}`} aria-hidden className="bg-background px-2 text-h5">
							…
						</li>
					) : (
						<li key={page}>
							<Link
								href={buildUrl(basePath, page, filters)}
								aria-current={page === currentPage ? "page" : undefined}
								aria-label={`Page ${page}`}
								className="hull-btn hull-btn-large min-w-12 aria-[current=page]:[--btn-bg:var(--ink)] aria-[current=page]:[--btn-fg:var(--page)]"
							>
								{page}
							</Link>
						</li>
					),
				)}
				{currentPage < totalPages && (
					<li>
						<Link href={buildUrl(basePath, currentPage + 1, filters)} className="hull-btn hull-btn-large">
							Next
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}
