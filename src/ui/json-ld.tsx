import { formatProductName } from "@/lib/utils";
import type * as Commerce from "commerce-kit";
import { getDecimalFromStripeAmount } from "commerce-kit/currencies";
import type { ItemList, Product, Thing, WebSite, WithContext } from "schema-dts";
import type Stripe from "stripe";

export const JsonLd = <T extends Thing>({ jsonLd }: { jsonLd: WithContext<T> }) => {
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
};

export const mappedProductToJsonLd = (product: Commerce.MappedProduct): WithContext<Product> => {
	const productName = formatProductName(product.name, product.metadata.variant);

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: productName,
		image: product.images[0],
		description: product.description ?? undefined,
		sku: product.id,
		offers: {
			"@type": "Offer",
			price: getDecimalFromStripeAmount({
				amount: product.default_price.unit_amount ?? 0,
				currency: product.default_price.currency,
			}),
			priceCurrency: product.default_price.currency,
			availability:
				product.metadata.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
		},
	};
};

export const mappedProductsToJsonLd = (
	products: readonly Commerce.MappedProduct[],
): WithContext<ItemList> => {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: products.map(mappedProductToJsonLd),
	};
};

export const accountToWebsiteJsonLd = ({
	account,
	logoUrl,
}: {
	account: Stripe.Account | null | undefined;
	logoUrl: string | null | undefined;
}): WithContext<WebSite> => {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: account?.business_profile?.name ?? "Your Next Store",
		url: account?.business_profile?.url ?? "https://yournextstore.com",
		mainEntityOfPage: {
			"@type": "WebPage",
			url: account?.business_profile?.url ?? "https://yournextstore.com",
		},
		...(logoUrl && {
			image: {
				"@type": "ImageObject",
				url: logoUrl,
			},
		}),
		publisher: {
			"@type": "Organization",
			name: account?.business_profile?.name ?? "Your Next Store",
			url: account?.business_profile?.url ?? "https://yournextstore.com",
		},
	};
};
