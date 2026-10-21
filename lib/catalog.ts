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
			const inCategory = products.filter((p) => p.category?.id === category.id);
			const product = inCategory.find((p) => firstStill(p.images)) ?? inCategory[0];
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

/** Active collections with an image of their own or, failing that, one of their products'. */
export async function getCollectionTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return collections.data
		.filter((collection) => collection.active && collection.productCollections.length > 0)
		.map((collection) => {
			const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
			const product = products.find((p) => memberIds.has(p.id) && firstStill(p.images));
			return {
				id: collection.id,
				name: collection.name,
				href: `/collection/${collection.slug}`,
				image: collection.image ?? firstStill(product?.images),
				description: richTextToPlain(collection.description),
			};
		})
		.filter((tile) => tile.image)
		.slice(0, limit);
}

export type CatalogNavEntry = { key: string; name: string; href: string; count: number };

/**
 * The original's sidebar list ("Facial Products³, Hair Products³ …"): every non-empty category,
 * or the collections when the store has no categories, each with its product count, under an
 * "All products" entry.
 */
export async function getCatalogNav(): Promise<CatalogNavEntry[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, collections, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const categoryEntries = categories.data
		.filter((category) => !category.parentId)
		.map((category) => ({
			key: `category:${category.slug}`,
			name: category.name,
			href: `/category/${category.slug}`,
			count: products.filter((p) => p.category?.id === category.id).length,
		}));
	const collectionEntries = collections.data
		.filter((collection) => collection.active)
		.map((collection) => ({
			key: `collection:${collection.slug}`,
			name: collection.name,
			href: `/collection/${collection.slug}`,
			count: collection.productCollections.length,
		}));
	const groups = [...categoryEntries, ...collectionEntries].filter((entry) => entry.count > 0);
	return [{ key: "all", name: "All products", href: "/products", count: products.length }, ...groups];
}
