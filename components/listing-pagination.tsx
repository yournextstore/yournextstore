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

const circle =
	"flex size-12 items-center justify-center rounded-full border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime";

/** Soul's round pagination arrows, with the page numbers between them. Carries every active filter. */
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
		<nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2 md:mt-14">
			{currentPage > 1 ? (
				<Link
					href={buildUrl(basePath, currentPage - 1, filters)}
					aria-label="Previous page"
					className={cn(circle, "border-contrast-100 hover:bg-contrast-100")}
				>
					<ArrowLeft className="size-5" strokeWidth={1.5} />
				</Link>
			) : (
				<span aria-hidden="true" className={cn(circle, "border-contrast-100 opacity-25")}>
					<ArrowLeft className="size-5" strokeWidth={1.5} />
				</span>
			)}
			<ul className="flex items-center gap-1">
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<li key={`ellipsis-${index}`} aria-hidden="true" className="px-1 text-contrast-500">
							…
						</li>
					) : (
						<li key={page}>
							<Link
								href={buildUrl(basePath, page, filters)}
								aria-current={page === currentPage ? "page" : undefined}
								className={cn(
									circle,
									"size-10 border-transparent",
									page === currentPage ? "bg-foreground text-background" : "hover:bg-contrast-100",
								)}
							>
								{page}
							</Link>
						</li>
					),
				)}
			</ul>
			{currentPage < totalPages ? (
				<Link
					href={buildUrl(basePath, currentPage + 1, filters)}
					aria-label="Next page"
					className={cn(circle, "border-contrast-100 hover:bg-contrast-100")}
				>
					<ArrowRight className="size-5" strokeWidth={1.5} />
				</Link>
			) : (
				<span aria-hidden="true" className={cn(circle, "border-contrast-100 opacity-25")}>
					<ArrowRight className="size-5" strokeWidth={1.5} />
				</span>
			)}
		</nav>
	);
}
