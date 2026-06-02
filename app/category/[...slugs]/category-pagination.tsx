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

function buildUrl(basePath: string, page: number) {
	return page > 1 ? `${basePath}?page=${page}` : basePath;
}

export function CategoryPagination({
	basePath,
	currentPage,
	totalPages,
}: {
	basePath: string;
	currentPage: number;
	totalPages: number;
}) {
	if (totalPages <= 1) return null;

	const pageNumbers = getPageNumbers(currentPage, totalPages);

	return (
		<Pagination className="mt-12">
			<PaginationContent>
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious href={buildUrl(basePath, currentPage - 1)} />
					</PaginationItem>
				)}
				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<PaginationItem key={`ellipsis-${index}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={page}>
							<PaginationLink href={buildUrl(basePath, page)} isActive={page === currentPage}>
								{page}
							</PaginationLink>
						</PaginationItem>
					),
				)}
				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationNext href={buildUrl(basePath, currentPage + 1)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
}
