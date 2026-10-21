import type { APIProductGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

type FullProduct = NonNullable<APIProductGetByIdResult>;

/** Narrow to the featured variant (its price, image, quick-add); unknown ids keep the full product. */
const featuredVariantOnly = (product: FullProduct, variantId: string | undefined): FullProduct => {
	const variant = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
	return variant ? { ...product, variants: [variant] } : product;
};

/** The editor stores product ids (plus an optional productId → variantId map); the storefront resolves them. */
export async function BlogProductEmbed({
	productIds,
	variantIds = {},
}: {
	productIds: string[];
	variantIds?: Record<string, string>;
}) {
	"use cache";
	cacheLife("minutes");

	const products = (await Promise.all(productIds.map((id) => commerce.productGet({ idOrSlug: id }))))
		.filter((product): product is FullProduct => product !== null && product.status === "published")
		.map((product) => featuredVariantOnly(product, variantIds[product.id]));

	if (products.length === 0) {
		return null;
	}

	return (
		<ul className="not-prose my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<li key={product.id} className="aspect-square">
					<ProductCard product={product} heading="h3" />
				</li>
			))}
		</ul>
	);
}
