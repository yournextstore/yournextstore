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

/** Active collections with an image of their own or, failing that, one of their products'. */
export async function getCollectionTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, products] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return (
		collections.data
			// A manual collection with no members would open on an empty page.
			.filter(
				(collection) =>
					collection.active &&
					(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0),
			)
			.map((collection) => {
				const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
				const product = products.find((p) => memberIds.has(p.id));
				return {
					id: collection.id,
					name: collection.name,
					href: `/collection/${collection.slug}`,
					image: collection.image ?? firstStill(product?.images),
					description: richTextToPlain(collection.description),
				};
			})
			.filter((tile) => tile.image)
			.slice(0, limit)
	);
}

type Pictured = {
	images?: readonly string[] | null;
	variants?: readonly { images?: readonly string[] | null }[];
};

/** Products with a photograph of their own first (variant photos count), the rest after, order otherwise kept. */
export function picturedFirst<T extends Pictured>(products: readonly T[]): T[] {
	const pictured = (product: T) =>
		Boolean(firstStill(product.images) ?? product.variants?.map((v) => firstStill(v.images)).find(Boolean));
	return [...products.filter(pictured), ...products.filter((product) => !pictured(product))];
}

/** The product a hero should feature: the first with several photographs, else the first pictured one. */
export function heroPick<T extends Pictured>(products: readonly T[]): T | undefined {
	const multi = products.find(
		(product) => (product.images ?? []).filter((image) => !isVideoUrl(image)).length > 1,
	);
	return multi ?? products[0];
}
