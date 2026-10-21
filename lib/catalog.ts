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

// One browse of the catalog backs the home rails and the category tiles (which only list
// categories that have products), so it is cached once and shared.
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

/** Top-level categories that have products, with their own image when they have one. */
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
				image: category.image ?? null,
				description: richTextToPlain(category.description),
				hasProducts: Boolean(product),
			};
		})
		.filter((tile) => tile.hasProducts)
		.slice(0, limit)
		.map(({ hasProducts: _, ...tile }) => tile);
}

/** Active collections, with their own image when they have one. */
export async function getCollectionTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const collections = await commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] }));
	return collections.data
		.filter((collection) => collection.active)
		.map((collection) => ({
			id: collection.id,
			name: collection.name,
			href: `/collection/${collection.slug}`,
			image: collection.image ?? null,
			description: richTextToPlain(collection.description),
		}))
		.slice(0, limit);
}

export type FeatureProduct = Awaited<ReturnType<typeof getCatalogProducts>>[number];

/** The catalog's products in browse order, photographed ones first, for rails that just need "some products". */
export async function getRailProducts(limit: number, offset = 0): Promise<FeatureProduct[]> {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const pictured = products.filter((product) => firstStill(product.images));
	const rest = products.filter((product) => !firstStill(product.images));
	return [...pictured, ...rest].slice(offset, offset + limit);
}

export function productStill(product: { images: readonly string[] }) {
	return firstStill(product.images);
}
