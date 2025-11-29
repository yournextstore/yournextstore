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

function buildUrl(page: number, sort?: string) {
	const params = new URLSearchParams();
	if (page > 1) params.set("page", String(page));
	if (sort) params.set("sort", sort);
	const qs = params.size ? `?${params.toString()}` : "";
	return `/products${qs}`;
}

export function ProductsPagination({
	currentPage,
	totalPages,
	sort,
}: {
	currentPage: number;
	totalPages: number;
	sort?: string;
}) {
	if (totalPages <= 1) return null;

	const pageNumbers = getPageNumbers(currentPage, totalPages);

	return (
		<Pagination className="mt-12">
			<PaginationContent>
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious href={buildUrl(currentPage - 1, sort)} />
					</PaginationItem>
				)}
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<PaginationItem key={`ellipsis-${index}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={page}>
							<PaginationLink href={buildUrl(page, sort)} isActive={page === currentPage}>
								{page}
							</PaginationLink>
						</PaginationItem>
					),
				)}
				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationNext href={buildUrl(currentPage + 1, sort)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
}
