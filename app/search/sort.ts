export type SortKey = "newest" | "priceAsc" | "priceDesc" | "nameAsc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: "newest", label: "Newest" },
	{ value: "priceAsc", label: "Price, low to high" },
	{ value: "priceDesc", label: "Price, high to low" },
	{ value: "nameAsc", label: "Alphabetical" },
];

export function getSortFromParams(value: string | undefined): SortKey {
	return SORT_OPTIONS.some((s) => s.value === value) ? (value as SortKey) : "newest";
}

export function sortToBrowseParams(sort: SortKey) {
	switch (sort) {
		case "priceAsc":
			return { orderBy: "price" as const, orderDirection: "asc" as const };
		case "priceDesc":
			return { orderBy: "price" as const, orderDirection: "desc" as const };
		case "nameAsc":
			return { orderBy: "name" as const, orderDirection: "asc" as const };
		default:
			return { orderBy: "createdAt" as const, orderDirection: "desc" as const };
	}
}
