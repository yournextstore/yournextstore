import type {
	APICollectionGetByIdResult,
	APIPostGetByIdResult,
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

// A plain child, no dangerouslySetInnerHTML: React escapes `<script` and `</script` inside a script's text when it
// renders on the server (as `<script`), so a product name can't end the tag or trap its closing one.
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
	return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}

export async function buildProductJsonLd(
	product: APIProductGetByIdResult,
	reviews: APIProductReviewsBrowseResult | null,
	brandName: string | null,
): Promise<Record<string, unknown>> {
	const { currency: storeCurrency, taxBehavior } = await getStoreConfig();
	// schema.org `price` must be the price the shopper sees on the page — gross on an
	// inclusive store, net on an exclusive one. Same rule the platform storefront emits.
	const { min, max } = priceRange(product.variants, taxBehavior);
	const currency = storeCurrency.toUpperCase();
	// Minor units per the currency's decimals: 1999 is ¥1999, not ¥19.99.
	const lowPrice = minorUnitsToMajor({ amount: min, currency });
	const highPrice = minorUnitsToMajor({ amount: max, currency });
	const url = `${getBaseUrl()}/product/${product.slug}`;
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
		brand: brandName ? { "@type": "Brand", name: brandName } : undefined,
		// One price is one Offer, however many variants share it (sizes of the same shirt): Google's merchant listings
		// read `price`, and an AggregateOffer with lowPrice equal to highPrice says less.
		offers:
			min === max
				? {
						"@type": "Offer",
						url,
						priceCurrency: currency,
						price: lowPrice,
						availability,
					}
				: {
						"@type": "AggregateOffer",
						url,
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
		// Plain links, not Product: Google rejects a Product snippet without offers, and the
		// product page carries the full Product.
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: collection.productCollections.length,
			itemListElement: collection.productCollections.map((pc, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: pc.product.name,
				url: `${baseUrl}/product/${pc.product.slug}`,
			})),
		},
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

async function getStoreOrganization() {
	const me = await meGetCached();
	const logo =
		typeof me.store.settings?.logo === "string" ? me.store.settings.logo : me.store.settings?.logo?.imageUrl;
	const ogImage = me.store.settings?.ogimage || undefined;
	return {
		"@type": "Organization",
		name: me.store.name || "Your Next Store",
		url: getBaseUrl(),
		...(logo ? { logo } : {}),
		...(ogImage ? { image: ogImage } : {}),
	};
}

// Posts carry no author, so the store stands in as both author and publisher.
export async function buildBlogPostingJsonLd(
	post: NonNullable<APIPostGetByIdResult>,
): Promise<Record<string, unknown>> {
	const organization = await getStoreOrganization();
	const url = `${getBaseUrl()}/blog/${post.slug}`;
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		url,
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
		datePublished: post.publishedAt ?? post.createdAt,
		dateModified: post.updatedAt,
		author: organization,
		publisher: organization,
		...(post.image ? { image: post.image } : {}),
		...(post.seo?.description ? { description: post.seo.description } : {}),
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
