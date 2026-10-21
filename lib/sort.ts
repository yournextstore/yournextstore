// Plain module on purpose: a constant exported from a "use client" file reaches server
// components as a client reference, not an array.
export const SORT_OPTIONS = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price low to high", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price high to low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name A–Z", orderBy: "name", orderDirection: "asc" },
] as const;
