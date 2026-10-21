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

type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>[number];

/** A product's first still, falling back to its variants' photographs. */
const productStill = (product: CatalogProduct | undefined) =>
	product
		? (firstStill(product.images) ?? firstStill(product.variants.flatMap((variant) => variant.images ?? [])))
		: null;

/** The first still among `products`, so a tile is never pictured by an imageless product. */
const firstProductStill = (products: CatalogProduct[]) =>
	products.map(productStill).find((image) => image !== null) ?? null;

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
			const members = products.filter((p) => p.category?.id === category.id);
			return {
				id: category.id,
				name: category.name,
				href: `/category/${category.slug}`,
				image: category.image ?? firstProductStill(members),
				description: richTextToPlain(category.description),
				hasProducts: members.length > 0,
			};
		})
		.filter((tile) => tile.hasProducts && tile.image)
		.slice(0, limit)
		.map(({ hasProducts: _, ...tile }) => tile);
}

/**
 * Active collections that have products (hand-picked members or smart rules), pictured by their
 * own image or, failing that, one of their products'.
 */
export async function getCollectionTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return collections.data
		.filter(
			(collection) =>
				collection.active &&
				(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0),
		)
		.map((collection) => {
			const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
			return {
				id: collection.id,
				name: collection.name,
				href: `/collection/${collection.slug}`,
				image: collection.image ?? firstProductStill(products.filter((p) => memberIds.has(p.id))),
				description: richTextToPlain(collection.description),
			};
		})
		.filter((tile) => tile.image)
		.slice(0, limit);
}

/**
 * The browse rail: collections first; a store with fewer than `minimum` of them is topped up
 * with its categories, so the rail never shows a lone card. `mixed` says categories were added.
 */
export async function getBrowseTiles(
	limit: number,
	minimum = 3,
): Promise<{ tiles: ShowcaseTile[]; mixed: boolean }> {
	const collections = await getCollectionTiles(limit);
	if (collections.length >= minimum) return { tiles: collections, mixed: false };
	const categories = await getCategoryTiles(limit - collections.length);
	const tiles = [...collections, ...categories];
	return { tiles, mixed: categories.length > 0 && collections.length > 0 };
}
