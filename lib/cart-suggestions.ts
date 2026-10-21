import { cacheLife } from "next/cache";
import { getCatalogProducts } from "@/lib/aqua";
import { getProductThumbnail } from "@/lib/utils";

export type CartSuggestion = {
	variantId: string;
	sku: string | null;
	price: string;
	priceGross: string | null;
	images: string[];
	product: { id: string; name: string; slug: string; images: string[] };
	image: string | null;
};

/**
 * The drawer's "Add-ons" list (the reference's cross-sell): single-variant products, cheapest
 * first, so a one-tap "Add" never needs an option picker. Cached and handed to the client drawer.
 */
export async function getCartSuggestions(): Promise<CartSuggestion[]> {
	"use cache";
	cacheLife("minutes");
	const { products } = await getCatalogProducts();
	return products
		.filter(
			(product) =>
				product.variants.length === 1 &&
				product.variants[0]?.stock !== 0 &&
				Number(product.variants[0]?.price) > 0,
		)
		.flatMap((product) => {
			const variant = product.variants[0];
			if (!variant) return [];
			return [
				{
					variantId: variant.id,
					sku: variant.sku ?? null,
					price: variant.price,
					priceGross: variant.priceGross ?? null,
					images: variant.images ?? [],
					product: { id: product.id, name: product.name, slug: product.slug, images: product.images ?? [] },
					image: getProductThumbnail([...(variant.images ?? []), ...(product.images ?? [])]) ?? null,
				},
			];
		})
		.toSorted((a, b) => Number(a.price) - Number(b.price))
		.slice(0, 8);
}
