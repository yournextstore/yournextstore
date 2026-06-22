import { ChevronLeft, ChevronRight } from "lucide-react";
import { YnsLink } from "@/components/yns-link";

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

function buildUrl(basePath: string, params: Record<string, string | undefined>) {
	const search = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== "") {
			search.set(key, value);
		}
	});
	const qs = search.size ? `?${search.toString()}` : "";
	return `${basePath}${qs}`;
}

type Props = {
	currentPage: number;
	totalPages: number;
	basePath?: string;
	extraParams?: Record<string, string | undefined>;
	sort?: string;
};

export function ProductsPagination({
	currentPage,
	totalPages,
	basePath = "/products",
	extraParams = {},
	sort,
}: Props) {
	if (totalPages <= 1) return null;

	const pageNumbers = getPageNumbers(currentPage, totalPages);
	const params = (page: number) => ({
		...extraParams,
		...(sort ? { sort } : {}),
		...(page > 1 ? { page: String(page) } : {}),
	});

	const baseChip =
		"label-caps inline-flex items-center justify-center neo-border px-3 h-10 min-w-10 bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] transition-colors";

	return (
		<nav className="mt-12 flex justify-center" aria-label="Pagination">
			<ul className="flex flex-wrap items-center gap-2">
				{currentPage > 1 && (
					<li>
						<YnsLink
							prefetch="eager"
							href={buildUrl(basePath, params(currentPage - 1))}
							className={baseChip}
							aria-label="Previous page"
						>
							<ChevronLeft className="h-4 w-4" />
						</YnsLink>
					</li>
				)}
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<li key={`ellipsis-${index}`} className="label-caps text-[var(--color-on-surface-variant)] px-2">
							…
						</li>
					) : (
						<li key={page}>
							<YnsLink
								prefetch="eager"
								href={buildUrl(basePath, params(page))}
								className={`${baseChip} ${page === currentPage ? "bg-foreground text-background hover:bg-foreground hover:text-background" : ""}`}
								aria-current={page === currentPage ? "page" : undefined}
							>
								{page}
							</YnsLink>
						</li>
					),
				)}
				{currentPage < totalPages && (
					<li>
						<YnsLink
							prefetch="eager"
							href={buildUrl(basePath, params(currentPage + 1))}
							className={baseChip}
							aria-label="Next page"
						>
							<ChevronRight className="h-4 w-4" />
						</YnsLink>
					</li>
				)}
			</ul>
		</nav>
	);
}
