export const sortOptions = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Least expensive", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Most expensive", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

export const findSort = (value: string | undefined) =>
	sortOptions.find((option) => option.value === value) ?? sortOptions[0];

export type FacetOption = { value: string; label: string };
export type FacetControl = {
	param: "category" | "collection" | "brand";
	placeholder: string;
	options: FacetOption[];
};

/** Same grid as the original's Sort / Category / Brand / Availability row. */
export const TOOLBAR_GRID = "mb-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4";
