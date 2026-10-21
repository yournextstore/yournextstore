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

const item = "inline-flex h-6 min-w-6 items-center justify-center";

/** Numbered pagination in Photon's bare text style. Carries every active filter across page links. */
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
		<nav aria-label="Pagination" className="px-[var(--main-gap)] py-4">
			<ul className="flex flex-wrap items-center justify-center gap-x-[var(--main-gap)]">
				{currentPage > 1 && (
					<li>
						<Link href={buildUrl(basePath, currentPage - 1, filters)} className={item} rel="prev">
							Previous
						</Link>
					</li>
				)}
				{getPageNumbers(currentPage, totalPages).map((page, index) =>
					page === "ellipsis" ? (
						<li key={`ellipsis-${index}`} aria-hidden className={item}>
							…
						</li>
					) : (
						<li key={page}>
							<Link
								href={buildUrl(basePath, page, filters)}
								aria-current={page === currentPage ? "page" : undefined}
								className={page === currentPage ? `${item} underline` : item}
							>
								{page}
							</Link>
						</li>
					),
				)}
				{currentPage < totalPages && (
					<li>
						<Link href={buildUrl(basePath, currentPage + 1, filters)} className={item} rel="next">
							Next
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}
