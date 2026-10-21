import Link from "next/link";

function buildUrl(basePath: string, page: number, filters: Record<string, string | undefined> = {}) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(filters)) {
		if (value && key !== "page") params.set(key, value);
	}
	if (page > 1) params.set("page", String(page));
	return params.size ? `${basePath}?${params}` : basePath;
}

const buttonClass =
	"inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none";

/** Penny's pagination: Previous at the left, Next at the right. Carries every active filter. */
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
			className="mx-auto mt-6 flex max-w-7xl items-center justify-between gap-2 px-4 text-sm font-medium text-gray-700 sm:px-6 lg:px-8"
		>
			<div className="flex-1">
				{currentPage > 1 && (
					<Link href={buildUrl(basePath, currentPage - 1, filters)} className={buttonClass}>
						Previous
					</Link>
				)}
			</div>
			<p className="text-gray-500">
				Page {currentPage} of {totalPages}
			</p>
			<div className="flex flex-1 justify-end">
				{currentPage < totalPages && (
					<Link href={buildUrl(basePath, currentPage + 1, filters)} className={buttonClass}>
						Next
					</Link>
				)}
			</div>
		</nav>
	);
}
