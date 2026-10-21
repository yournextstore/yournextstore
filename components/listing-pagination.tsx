import Link from "next/link";

function buildUrl(basePath: string, page: number, filters: Record<string, string | undefined> = {}) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(filters)) {
		if (value && key !== "page") params.set(key, value);
	}
	if (page > 1) params.set("page", String(page));
	return params.size ? `${basePath}?${params}` : basePath;
}

const pill =
	"inline-flex h-11 items-center rounded-full border px-5 text-sm transition-colors border-ink/25 text-ink hover:border-gold hover:text-gold";
const disabled = "inline-flex h-11 items-center rounded-full border border-line px-5 text-sm text-ink/60";

/** The original's pager: Previous and Next pills around "Page n of m". Carries every active filter. */
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
		<nav aria-label="Pages" className="mt-16 flex items-center justify-between gap-4">
			{currentPage > 1 ? (
				<Link href={buildUrl(basePath, currentPage - 1, filters)} className={pill} rel="prev">
					Previous
				</Link>
			) : (
				<span aria-hidden="true" className={disabled}>
					Previous
				</span>
			)}
			<p className="text-sm text-ink/80">
				Page {currentPage} of {totalPages}
			</p>
			{currentPage < totalPages ? (
				<Link href={buildUrl(basePath, currentPage + 1, filters)} className={pill} rel="next">
					Next
				</Link>
			) : (
				<span aria-hidden="true" className={disabled}>
					Next
				</span>
			)}
		</nav>
	);
}
