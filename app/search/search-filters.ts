/** The search page's filters, as URL parameters and as the API's product list and filter counts take them. */
export const SEARCH_FILTER_KEYS = ["category", "brand", "priceMin", "priceMax", "vts", "filter"] as const;

export type SearchFilters = Partial<Record<(typeof SEARCH_FILTER_KEYS)[number], string>>;

export const searchFiltersFrom = (query: Record<string, string | string[] | undefined>): SearchFilters =>
	Object.fromEntries(
		SEARCH_FILTER_KEYS.flatMap((key) => {
			const value = query[key];
			return typeof value === "string" && value ? [[key, value]] : [];
		}),
	);

const minorUnits = (value: string | undefined) => {
	const amount = Number(value);
	return value && Number.isInteger(amount) && amount >= 0 ? amount : undefined;
};

export const toBrowseFilters = (filters: SearchFilters) => ({
	category: filters.category,
	brand: filters.brand,
	priceMin: minorUnits(filters.priceMin),
	priceMax: minorUnits(filters.priceMax),
	vts: filters.vts,
	filter: filters.filter,
});
