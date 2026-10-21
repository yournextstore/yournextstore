import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
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
	const step = "inline-flex size-10 items-center justify-center rounded-full border border-foreground";

	return (
		<nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-6">
			{currentPage > 1 ? (
				<Link href={buildUrl(basePath, currentPage - 1, filters)} aria-label="Previous page" className={step}>
					<ArrowLeftIcon className="size-5" />
				</Link>
			) : null}
			<ul className="flex items-end gap-2">
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<li
							key={`ellipsis-${index}`}
							aria-hidden
							className="px-1 text-body-lg font-medium text-grayscale-500"
						>
							…
						</li>
					) : (
						<li key={page}>
							<Link
								href={buildUrl(basePath, page, filters)}
								aria-current={page === currentPage ? "page" : undefined}
								className={cn(
									"inline-flex min-h-6 min-w-6 justify-center border-b px-1 text-body-lg font-medium transition-colors",
									page === currentPage
										? "border-foreground text-foreground"
										: "border-transparent text-grayscale-500 hover:text-foreground",
								)}
							>
								{page}
							</Link>
						</li>
					),
				)}
			</ul>
			{currentPage < totalPages ? (
				<Link href={buildUrl(basePath, currentPage + 1, filters)} aria-label="Next page" className={step}>
					<ArrowRightIcon className="size-5" />
				</Link>
			) : null}
		</nav>
	);
}
