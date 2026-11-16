import type { APICollectionGetByIdResult, APIProductGetByIdResult } from "commerce-kit";
import { getCanonicalUrl, meGetCached } from "@/lib/commerce";

function getBaseUrl(): string {
	return getCanonicalUrl();
}

// A plain child, no dangerouslySetInnerHTML: React escapes `<script` and `</script` inside a script's text when it
// renders on the server (as `<script`), so a product name can't end the tag or trap its closing one.
export function JsonLdScript({ data }: { data: object }) {
	return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}

/**
 * The schema.org JSON-LD the API generates for a product, collection, blog post or order page, rendered as-is.
 * The platform's tracking reads it to report views and purchases. Read through a guard because the
 * pinned commerce-kit types may not carry the field yet.
 */
export function apiStructuredData(record: object): object | null {
	const data = "structuredData" in record ? record.structuredData : null;
	return typeof data === "object" && data !== null ? data : null;
}

export function buildProductBreadcrumbJsonLd(product: APIProductGetByIdResult): Record<string, unknown> {
	const baseUrl = getBaseUrl();
	const items = [
		{ "@type": "ListItem", position: 1, name: "Home", item: baseUrl || undefined },
		product.category
			? {
					"@type": "ListItem",
					position: 2,
					name: product.category.name,
					item: `${baseUrl}/category/${product.category.slug}`,
				}
			: null,
		{
			"@type": "ListItem",
			position: product.category ? 3 : 2,
			name: product.name,
		},
	].filter(Boolean);

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items,
	};
}

export function buildCollectionBreadcrumbJsonLd(
	collection: APICollectionGetByIdResult,
): Record<string, unknown> {
	const baseUrl = getBaseUrl();

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: baseUrl || undefined },
			{ "@type": "ListItem", position: 2, name: collection.name },
		],
	};
}

export function buildCategoryBreadcrumbJsonLd(
	hierarchy: Array<{ name: string; slug: string }>,
): Record<string, unknown> {
	const baseUrl = getBaseUrl();
	let path = "";

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: baseUrl || undefined },
			...hierarchy.map((category, index) => {
				path += `/${category.slug}`;
				return {
					"@type": "ListItem",
					position: index + 2,
					name: category.name,
					item: baseUrl ? `${baseUrl}/category${path}` : undefined,
				};
			}),
		],
	};
}

type SearchedProduct = {
	id: string;
	name: string;
	variants?: ReadonlyArray<{ id: string; sku: string | null }>;
};

/**
 * The search a results page shows, which the platform's tracking reports: a `SearchAction` with the query and, as
 * its result, the products on the page by id (`productID`, and the first variant's `sku || id`, as on a product
 * page). The API has no node for a search, and the page is not indexed, so these product nodes are only references.
 */
export function buildSearchResultsJsonLd(
	query: string,
	products: ReadonlyArray<SearchedProduct>,
): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "SearchResultsPage",
		mainEntity: {
			"@type": "SearchAction",
			actionStatus: "CompletedActionStatus",
			query,
			result: {
				"@type": "ItemList",
				itemListElement: products.map((product, index) => {
					const variant = product.variants?.[0];
					return {
						"@type": "ListItem",
						position: index + 1,
						item: {
							"@type": "Product",
							productID: product.id,
							name: product.name,
							...(variant ? { sku: variant.sku || variant.id } : {}),
						},
					};
				}),
			},
		},
	};
}

// The store's social profiles, for `sameAs`. The admin fields are free text, so only a full https address counts:
// a handle or a bare domain is not a link, and `email` is an address, not a profile.
function socialProfileUrls(socials: Record<string, string | null | undefined> | null | undefined) {
	return Object.entries(socials ?? {}).flatMap(([network, value]) => {
		const url = value?.trim();
		if (network === "email" || !url || !URL.canParse(url)) return [];
		return new URL(url).protocol === "https:" ? [url] : [];
	});
}

async function getStoreOrganization() {
	const me = await meGetCached();
	const logo =
		typeof me.store.settings?.logo === "string" ? me.store.settings.logo : me.store.settings?.logo?.imageUrl;
	const ogImage = me.store.settings?.ogimage || undefined;
	const sameAs = socialProfileUrls(me.store.settings?.socials);
	return {
		"@type": "Organization",
		name: me.store.name || "Your Next Store",
		url: getBaseUrl(),
		...(logo ? { logo } : {}),
		...(ogImage ? { image: ogImage } : {}),
		...(sameAs.length > 0 ? { sameAs } : {}),
	};
}

export async function StoreJsonLd() {
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription = me.store.settings?.storeDescription || undefined;
	const baseUrl = getBaseUrl();
	const ogImage = me.store.settings?.ogimage || undefined;

	const organization = {
		"@context": "https://schema.org",
		...(await getStoreOrganization()),
	};

	const website = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: storeName,
		url: baseUrl,
		description: storeDescription,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${baseUrl}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};

	const store = {
		"@context": "https://schema.org",
		"@type": "Store",
		name: storeName,
		description: storeDescription,
		url: baseUrl,
		...(ogImage ? { image: ogImage } : {}),
	};

	return (
		<>
			<JsonLdScript data={organization} />
			<JsonLdScript data={website} />
			<JsonLdScript data={store} />
		</>
	);
}
