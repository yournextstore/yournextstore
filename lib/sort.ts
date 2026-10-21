export const sortOptions = [
	{ value: "newest", label: "Default", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: low to high", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: high to low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export function resolveSort(value: string | undefined) {
	return sortOptions.find((option) => option.value === value) ?? sortOptions[0];
}
