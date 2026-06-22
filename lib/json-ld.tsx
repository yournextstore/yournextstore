import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductReviewsBrowseResult,
} from "commerce-kit";
import { getCanonicalUrl, meGetCached } from "@/lib/commerce";
import { CURRENCY } from "@/lib/constants";

async function getCurrency(): Promise<string> {
	try {
		const me = await meGetCached();
		return me.store.currency?.toUpperCase() || CURRENCY;
	} catch {
		return CURRENCY;
	}
}

function getDecimalPrice(minorAmount: string): string {
	return (Number(minorAmount) / 100).toFixed(2);
}

function getBaseUrl(): string {
	return getCanonicalUrl();
}

export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
		/>
	);
}

export async function buildProductJsonLd(
	product: APIProductGetByIdResult,
	reviews: APIProductReviewsBrowseResult | null,
): Promise<Record<string, unknown>> {
	const prices = product.variants.map((v) => Number(v.price));
	const lowPrice = getDecimalPrice(String(Math.min(...prices)));
	const highPrice = getDecimalPrice(String(Math.max(...prices)));
	const baseUrl = getBaseUrl();
	const currency = await getCurrency();

	const jsonLd: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.summary,
		image: product.images,
		sku: product.variants[0]?.sku ?? product.id,
		brand: product.category ? { "@type": "Brand", name: product.category.name } : undefined,
		offers:
			product.variants.length === 1
				? {
						"@type": "Offer",
						url: `${baseUrl}/product/${product.slug}`,
						priceCurrency: currency,
						price: lowPrice,
						availability:
							product.variants[0]?.stock === null || (product.variants[0]?.stock ?? 0) > 0
								? "https://schema.org/InStock"
								: "https://schema.org/OutOfStock",
					}
				: {
						"@type": "AggregateOffer",
						lowPrice,
						highPrice,
						priceCurrency: currency,
						offerCount: product.variants.length,
						availability: "https://schema.org/InStock",
					},
	};

	if (reviews && reviews.summary.reviewCount > 0) {
		jsonLd.aggregateRating = {
			"@type": "AggregateRating",
			ratingValue: reviews.summary.averageRating,
			reviewCount: reviews.summary.reviewCount,
			bestRating: 5,
			worstRating: 1,
		};

		jsonLd.review = reviews.data.map((r) => ({
			"@type": "Review",
			author: { "@type": "Person", name: r.author },
			datePublished: r.createdAt,
			reviewRating: {
				"@type": "Rating",
				ratingValue: r.rating,
				bestRating: 5,
				worstRating: 1,
			},
			reviewBody: r.content,
		}));
	}

	return jsonLd;
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
					item: `${baseUrl}/collection/${product.category.slug}`,
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

export function buildCollectionJsonLd(collection: APICollectionGetByIdResult): Record<string, unknown> {
	const baseUrl = getBaseUrl();

	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: collection.name,
		description:
			typeof collection.description === "string" ? collection.description : `${collection.name} collection`,
		image: collection.image ?? undefined,
		numberOfItems: collection.productCollections.length,
		hasPart: collection.productCollections.map((pc) => ({
			"@type": "Product",
			name: pc.product.name,
			url: `${baseUrl}/product/${pc.product.slug}`,
			image: pc.product.images[0],
		})),
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

export async function StoreJsonLd() {
	const me = await meGetCached();
	const storeName = me.store.name || "Vela";
	const storeDescription = me.store.settings?.storeDescription || undefined;
	const baseUrl = getBaseUrl();
	const ogImage = me.store.settings?.ogimage || undefined;
	const logo =
		typeof me.store.settings?.logo === "string" ? me.store.settings.logo : me.store.settings?.logo?.imageUrl;

	const organization = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: storeName,
		url: baseUrl,
		...(logo ? { logo } : {}),
		...(ogImage ? { image: ogImage } : {}),
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
