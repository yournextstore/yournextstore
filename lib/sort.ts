// Plain module: shared by server pages and the client sort select (a constant exported from a
// "use client" file reaches the server as a client reference, not the array).
export const SORT_OPTIONS = [
	{ value: "newest", label: "Newest first", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price ascending", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price descending", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name ascending", orderBy: "name", orderDirection: "asc" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function sortFor(value: string | undefined) {
	return SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];
}
