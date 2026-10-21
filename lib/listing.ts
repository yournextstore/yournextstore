// Plain module: shared between server pages and the client toolbar (a constant exported from
// a "use client" file reaches the server as a client reference, not a value).

export const SORT_OPTIONS = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price, low to high", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price, high to low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name, A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

export const PRODUCTS_PER_PAGE = 24;

/** Two columns on phones; three or four from desktop, as the density switch sets it. */
export const LISTING_GRID =
	"grid grid-cols-2 gap-x-2.5 gap-y-[18px] md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-7 [:root[data-density='3']_&]:lg:grid-cols-3";
