import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductReviewsBrowseResult,
} from "commerce-kit";
import { meGetCached } from "@/lib/commerce";
import { CURRENCY } from "@/lib/constants";

function getDecimalPrice(minorAmount: string): string {
	return (Number(minorAmount) / 100).toFixed(2);
}

function getBaseUrl(): string {
	return process.env.NEXT_PUBLIC_URL ?? "";
}

export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
		/>
	);
}

export function buildProductJsonLd(
	product: APIProductGetByIdResult,
	reviews: APIProductReviewsBrowseResult,
): Record<string, unknown> {
	const prices = product.variants.map((v) => Number(v.price));
	const lowPrice = getDecimalPrice(String(Math.min(...prices)));
	const highPrice = getDecimalPrice(String(Math.max(...prices)));
	const baseUrl = getBaseUrl();

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
						priceCurrency: CURRENCY,
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
						priceCurrency: CURRENCY,
						offerCount: product.variants.length,
						availability: "https://schema.org/InStock",
					},
	};

	if (reviews.summary.reviewCount > 0) {
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

export async function StoreJsonLd() {
	const me = await meGetCached();
	const storeName = me.store.settings?.storeName || "Your Next Store";
	const storeDescription = me.store.settings?.storeDescription || undefined;

	return (
		<JsonLdScript
			data={{
				"@context": "https://schema.org",
				"@type": "Store",
				name: storeName,
				description: storeDescription,
				url: getBaseUrl(),
			}}
		/>
	);
}
