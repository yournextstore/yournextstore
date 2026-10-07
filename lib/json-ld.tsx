import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductReviewsBrowseResult,
} from "commerce-kit";
import { getCanonicalUrl, meGetCached } from "@/lib/commerce";
import { minorUnitsToMajor } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

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
	const { currency: storeCurrency, taxBehavior } = await getStoreConfig();
	// schema.org `price` must be the price the shopper sees on the page — gross on an
	// inclusive store, net on an exclusive one. Same rule the platform storefront emits.
	const { min, max } = priceRange(product.variants, taxBehavior);
	const currency = storeCurrency.toUpperCase();
	// Minor units per the currency's decimals: 1999 is ¥1999, not ¥19.99.
	const lowPrice = minorUnitsToMajor({ amount: min, currency });
	const highPrice = minorUnitsToMajor({ amount: max, currency });
	const baseUrl = getBaseUrl();
	// `stock: null` means the variant doesn't track inventory.
	const availability = product.variants.some((variant) => variant.stock === null || (variant.stock ?? 0) > 0)
		? "https://schema.org/InStock"
		: "https://schema.org/OutOfStock";

	const jsonLd: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.summary,
		image: product.images,
		sku: product.variants[0]?.sku ?? product.id,
		offers:
			product.variants.length === 1
				? {
						"@type": "Offer",
						url: `${baseUrl}/product/${product.slug}`,
						priceCurrency: currency,
						price: lowPrice,
						availability,
					}
				: {
						"@type": "AggregateOffer",
						lowPrice,
						highPrice,
						priceCurrency: currency,
						offerCount: product.variants.length,
						availability,
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
	const storeName = me.store.name || "Your Next Store";
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
