import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

/** Flattens a TipTap document (or a plain string) into its visible text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	const node = value as { type?: unknown; text?: unknown; content?: unknown };
	if (typeof node.text === "string") return node.text;
	const children = Array.isArray(node.content) ? node.content.map(richTextToPlain) : [];
	// Text runs inside one block sit side by side; blocks are separated by a space.
	const inline = node.type === "paragraph" || node.type === "heading";
	return children
		.filter(Boolean)
		.join(inline ? "" : " ")
		.trim();
}

/** Splits rich text into its paragraphs, for layouts that set each one as its own block. */
export function richTextParagraphs(value: unknown): string[] {
	if (typeof value === "string") {
		return value
			.split("\n")
			.map((p) => p.trim())
			.filter(Boolean);
	}
	if (!value || typeof value !== "object") return [];
	const node = value as { content?: unknown };
	return Array.isArray(node.content) ? node.content.map(richTextToPlain).filter(Boolean) : [];
}

// One browse of the catalog backs every "no image of its own" fallback (collection and
// category tiles borrow their first product's photograph), so it is cached once and shared.
async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return data;
}

const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

export type ShowcaseTile = {
	id: string;
	name: string;
	href: string;
	image: string | null;
	description: string;
};

/** Top-level categories that have products, each pictured by its own image or its first product's. */
export async function getCategoryTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return categories.data
		.filter((category) => !category.parentId)
		.map((category) => {
			const product = products.find((p) => p.category?.id === category.id);
			return {
				id: category.id,
				name: category.name,
				href: `/category/${category.slug}`,
				image: category.image ?? firstStill(product?.images),
				description: richTextToPlain(category.description),
				hasProducts: Boolean(product),
			};
		})
		.filter((tile) => tile.hasProducts && tile.image)
		.slice(0, limit)
		.map(({ hasProducts: _, ...tile }) => tile);
}

/**
 * Active collections that actually hold products (a manual collection can be empty), pictured by
 * their own image or, failing that, their first product's.
 */
export async function getCollectionTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return collections.data
		.filter((collection) => collection.active)
		.flatMap((collection) => {
			const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
			const hasRules = Array.isArray(collection.metafieldRules) && collection.metafieldRules.length > 0;
			if (memberIds.size === 0 && !hasRules) return [];
			const product = products.find((p) => memberIds.has(p.id));
			const image = collection.image ?? firstStill(product?.images);
			return image
				? [
						{
							id: collection.id,
							name: collection.name,
							href: `/collection/${collection.slug}`,
							image,
							description: richTextToPlain(collection.description),
						},
					]
				: [];
		})
		.slice(0, limit);
}

/** Products with a photograph first (stable), so listings never open on an empty tile. */
export function picturedFirst<T extends { images?: readonly string[] | null; variants?: unknown }>(
	products: readonly T[],
): T[] {
	const pictured = (product: T) => {
		if (firstStill(product.images)) return true;
		const variants = Array.isArray(product.variants) ? (product.variants as { images?: string[] }[]) : [];
		return variants.some((variant) => firstStill(variant.images));
	};
	return [...products.filter(pictured), ...products.filter((product) => !pictured(product))];
}

export type HomeEditorial = {
	categories: ShowcaseTile[];
	collections: ShowcaseTile[];
};

/** The shop-by tiles the home page needs, from one cached read of the catalogue. */
export async function getHomeEditorial(): Promise<HomeEditorial> {
	"use cache";
	cacheLife("minutes");
	const [categories, collections] = await Promise.all([getCategoryTiles(4), getCollectionTiles(6)]);
	return { categories, collections };
}
