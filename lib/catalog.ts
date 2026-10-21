import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";

/** Top-level categories as the catalog's link row (minshop's category strip). */
export async function getCategoryLinks() {
	"use cache";
	cacheLife("hours");
	const result = await commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] }));
	return result.data
		.filter((category) => !category.parentId)
		.map((category) => ({ href: `/category/${category.slug}`, label: category.name }));
}

type Pictured = { images: string[]; variants: Array<{ images?: string[] | null }> };

const hasImage = (product: Pictured) =>
	product.images.length > 0 || product.variants.some((variant) => (variant.images ?? []).length > 0);

/** Photographed products first, keeping the given order otherwise. */
export function picturedFirst<T extends Pictured>(products: T[]): T[] {
	return [...products.filter(hasImage), ...products.filter((product) => !hasImage(product))];
}
