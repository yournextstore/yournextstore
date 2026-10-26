/**
 * Listings with a filter, sort or page number render per request on internal `…-filtered` routes; the default views
 * (`/products`, `/category/…`) never read the query, so they prerender in full. The public URL doesn't change:
 * `next.config.ts` rewrites it (`beforeFiles`) when one of the listing's parameters is present. `proxy.ts` is
 * platform-managed, which is why this lives in the config. These lists are the single source for the rewrites, the
 * filter types and the controls: a parameter missing here would silently get the unfiltered static view.
 */
export const FILTER_KEYS = ["category", "collection", "brand", "priceMin", "priceMax", "vts"] as const;

export const PRODUCT_LISTING_PARAMS = ["page", "sort", ...FILTER_KEYS] as const;
/** A category page is the category filter, so it isn't a parameter there. */
export const CATEGORY_LISTING_PARAMS = [
	"page",
	"collection",
	"brand",
	"priceMin",
	"priceMax",
	"vts",
] as const;

export type ListingParams<K extends string> = Partial<Record<K, string>>;
export type ProductListingParams = ListingParams<(typeof PRODUCT_LISTING_PARAMS)[number]>;
export type CategoryListingParams = ListingParams<(typeof CATEGORY_LISTING_PARAMS)[number]>;

const LISTINGS = [
	{ source: "/products", destination: "/products-filtered", params: PRODUCT_LISTING_PARAMS },
	{ source: "/category/:path*", destination: "/category-filtered/:path*", params: CATEGORY_LISTING_PARAMS },
];

/** One rewrite per parameter: a rewrite's `has` conditions all have to match, and any one parameter is enough here. */
export const listingRewrites = () =>
	LISTINGS.flatMap(({ source, destination, params }) =>
		params.map((key) => ({ source, destination, has: [{ type: "query" as const, key }] })),
	);

/** The listing's parameters from a query, nothing else: tracking parameters (utm_*, gclid) stay out of links and cache keys. */
export const activeParams = (
	keys: readonly string[],
	query: Record<string, string | string[] | undefined>,
): Record<string, string> =>
	Object.fromEntries(keys.flatMap((key) => (typeof query[key] === "string" ? [[key, query[key]]] : [])));

/** The active selection as `URLSearchParams`, for the filter and sort controls (empty fields dropped). */
export const toSearchParams = (active: Record<string, string | undefined>) =>
	new URLSearchParams(Object.entries(active).flatMap(([key, value]) => (value ? [[key, value]] : [])));
