import type {
	APICollectionGetByIdResult,
	APICollectionsBrowseQueryParams,
	APICollectionsBrowseResult,
	APIProductGetByIdResult,
	APIProductReviewsBrowseQueryParams,
	APIProductReviewsBrowseResult,
	APIProductsBrowseQueryParams,
	APIProductsBrowseResult,
} from "commerce-kit";
import { Commerce } from "commerce-kit";

const provider = Commerce({
	token: process.env.YNS_API_KEY,
});

/**
 * Locale-aware commerce client.
 * Wraps the base SDK to pass `lang` and `currency` query params to the API
 * so it returns localized product names/descriptions and prices.
 */
export function getCommerce(opts: { lang: string; currency: string }) {
	const { lang, currency } = opts;

	return {
		...provider,

		productBrowse(params: APIProductsBrowseQueryParams) {
			return provider.request<APIProductsBrowseResult>("/products", {
				query: {
					...(params.limit ? { limit: params.limit } : {}),
					...(params.offset ? { offset: params.offset } : {}),
					...(params.category ? { category: params.category } : {}),
					...(params.query ? { query: params.query } : {}),
					...(params.active !== undefined ? { active: params.active } : {}),
					...(params.orderBy ? { orderBy: params.orderBy } : {}),
					...(params.orderDirection ? { orderDirection: params.orderDirection } : {}),
					currency,
					lang,
				},
			});
		},

		async productGet(params: { idOrSlug: string }) {
			try {
				const result = await provider.request<APIProductGetByIdResult>(`/products/${params.idOrSlug}`, {
					query: { lang, currency },
				});
				return result || null;
			} catch (error) {
				console.error("[getCommerce.productGet] Error fetching product:", params.idOrSlug, error);
				return null;
			}
		},

		collectionBrowse(params: APICollectionsBrowseQueryParams) {
			return provider.request<APICollectionsBrowseResult>("/collections", {
				query: {
					...(params.limit ? { limit: params.limit } : {}),
					...(params.offset ? { offset: params.offset } : {}),
					...(params.query ? { query: params.query } : {}),
					...(params.active !== undefined ? { active: params.active } : {}),
					lang,
				},
			});
		},

		async collectionGet(params: { idOrSlug: string }) {
			try {
				const result = await provider.request<APICollectionGetByIdResult>(`/collections/${params.idOrSlug}`, {
					query: { lang, currency },
				});
				return result || null;
			} catch {
				return null;
			}
		},

		productReviewsBrowse(params: { idOrSlug: string }, queryParams?: APIProductReviewsBrowseQueryParams) {
			return provider.request<APIProductReviewsBrowseResult>(`/products/${params.idOrSlug}/reviews`, {
				query: {
					...(queryParams?.limit ? { limit: queryParams.limit } : {}),
					...(queryParams?.offset ? { offset: queryParams.offset } : {}),
					lang,
				},
			});
		},
	};
}

/** Base commerce client without locale — use for non-localized calls (cart, legal, me, etc.) */
export const commerce = provider;

const meGetCached = async (token?: string) => {
	"use cache: remote";

	const commerce = Commerce({ token });
	return commerce.meGet();
};

export const getSubdomainPublicUrl = async () => {
	const tenant = process.env.NEXT_PUBLIC_YNS_API_TENANT;
	if (tenant) {
		const tenantHost = new URL(tenant).host;
		const [subdomain, ...base] = tenantHost.split(".");
		const apiHost = base.join(".");
		if (subdomain && apiHost) {
			return {
				subdomain,
				publicUrl: `https://${apiHost}`,
			};
		}
	}

	// fallback to fetching from the API if env variable is not set or invalid
	const {
		store: { subdomain },
		publicUrl,
	} = await meGetCached(process.env.YNS_API_KEY);
	return { subdomain, publicUrl };
};
