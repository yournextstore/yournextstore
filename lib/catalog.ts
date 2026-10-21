import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { pickVisuallyDistinct } from "@/lib/display";

export type CatalogProduct = APIProductsBrowseResult["data"][number];

export type ShelfTile = {
	href: string;
	title: string;
	count: number;
	image: string | null;
};

/** One cached browse of the active catalogue feeds every home section. */
export async function getCatalog() {
	"use cache";
	cacheLife("minutes");
	const [error, result] = await try_(commerce.productBrowse({ active: true, limit: 100 }));
	return error ? [] : result.data;
}

/** Categories with at least one product, pictured by a product photo that the previous tiles did not use. */
export async function getCategoryTiles(): Promise<ShelfTile[]> {
	"use cache";
	cacheLife("minutes");
	const [products, categories] = await Promise.all([
		getCatalog(),
		commerce
			.categoriesBrowse({ limit: 50 })
			.then((r) => r.data)
			.catch(() => []),
	]);
	const used = new Set<string>();
	return categories
		.filter((category) => category.active !== false)
		.map((category) => {
			const members = products.filter((product) => product.categoryId === category.id);
			const pictured =
				members.find((product) => product.images[0] && !used.has(product.images[0])) ?? members[0];
			const image = pictured?.images[0] ?? null;
			if (image) used.add(image);
			return { href: `/category/${category.slug}`, title: category.name, count: members.length, image };
		})
		.filter((tile) => tile.count > 0);
}

/** The hero piece: the priciest single (non-bundle) product, as the original features its flagship piece. */
export async function getHeroProduct() {
	"use cache";
	cacheLife("minutes");
	const products = (await getCatalog()).filter((product) => product.images.length > 0);
	const singles = products.filter((product) => product.type !== "bundle");
	const pool = singles.length > 0 ? singles : products;
	const price = (product: CatalogProduct) => Math.min(...product.variants.map((v) => Number(v.price)));
	return [...pool].sort((a, b) => price(b) - price(a))[0] ?? null;
}

export async function getTrending(count: number, excludeId?: string) {
	"use cache";
	cacheLife("minutes");
	const products = (await getCatalog()).filter((product) => product.id !== excludeId);
	return pickVisuallyDistinct(products, count);
}
