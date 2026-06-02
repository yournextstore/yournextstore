import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

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

// Carries sort + every active filter across page changes. `page` is overwritten per link.
type PaginationFilters = Record<string, string | undefined>;

function buildUrl(page: number, filters: PaginationFilters) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(filters)) {
		if (value && key !== "page") params.set(key, value);
	}
	if (page > 1) params.set("page", String(page));
	const qs = params.size ? `?${params.toString()}` : "";
	return `/products${qs}`;
}

export function ProductsPagination({
	currentPage,
	totalPages,
	filters,
}: {
	currentPage: number;
	totalPages: number;
	filters: PaginationFilters;
}) {
	if (totalPages <= 1) return null;

	const pageNumbers = getPageNumbers(currentPage, totalPages);

	return (
		<Pagination className="mt-12">
			<PaginationContent>
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious href={buildUrl(currentPage - 1, filters)} />
					</PaginationItem>
				)}
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<PaginationItem key={`ellipsis-${index}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={page}>
							<PaginationLink href={buildUrl(page, filters)} isActive={page === currentPage}>
								{page}
							</PaginationLink>
						</PaginationItem>
					),
				)}
				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationNext href={buildUrl(currentPage + 1, filters)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
}
