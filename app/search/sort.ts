export type SortKey = "relevance" | "newest" | "priceAsc" | "priceDesc" | "nameAsc";

export const DEFAULT_SORT: SortKey = "relevance";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: "relevance", label: "Best match" },
	{ value: "newest", label: "Newest" },
	{ value: "priceAsc", label: "Price, low to high" },
	{ value: "priceDesc", label: "Price, high to low" },
	{ value: "nameAsc", label: "Alphabetical" },
];

export function getSortFromParams(value: string | undefined): SortKey {
	return SORT_OPTIONS.find((s) => s.value === value)?.value ?? DEFAULT_SORT;
}

/** Best match sends no order: the API then ranks a search by how well, how often bought and how available. */
export function sortToBrowseParams(sort: SortKey) {
	switch (sort) {
		case "relevance":
			return {};
		case "newest":
			return { orderBy: "createdAt" as const, orderDirection: "desc" as const };
		case "priceAsc":
			return { orderBy: "price" as const, orderDirection: "asc" as const };
		case "priceDesc":
			return { orderBy: "price" as const, orderDirection: "desc" as const };
		case "nameAsc":
			return { orderBy: "name" as const, orderDirection: "asc" as const };
	}
}
