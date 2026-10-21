// Shared by the listing pages (server) and the sort select (client): keep it out of "use client" files.
export const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: low to high", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: high to low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;
