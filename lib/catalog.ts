import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { EDITORIAL, type EditorialPhoto } from "@/lib/editorial";

type Doc = { type?: string; text?: string; content?: Doc[] };

/** Collection descriptions arrive as TipTap JSON (or a plain string); flatten them for a one-line lede. */
export function plainText(value: unknown): string {
	if (typeof value === "string") {
		return value;
	}
	if (!value || typeof value !== "object") {
		return "";
	}
	const node = value as Doc;
	const own = node.text ?? "";
	const children = (node.content ?? []).map(plainText).join(node.type === "doc" ? " " : "");
	return `${own}${children}`.replace(/\s+/g, " ").trim();
}

export type CollectionTile = {
	id: string;
	href: string;
	name: string;
	image: string;
};

type Pictured = { images: string[]; variants: Array<{ images?: string[] | null }> };

const hasImage = (product: Pictured) =>
	product.images.length > 0 || product.variants.some((variant) => (variant.images ?? []).length > 0);

/** Photographed products first, keeping the given order otherwise. */
export function picturedFirst<T extends Pictured>(products: T[]): T[] {
	return [...products.filter(hasImage), ...products.filter((product) => !hasImage(product))];
}

/** A stable editorial cover for a collection or category without an image of its own. */
export function listingCover(key: string): EditorialPhoto {
	const hash = Array.from(key).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
	return EDITORIAL.covers[hash % EDITORIAL.covers.length] ?? EDITORIAL.covers[0];
}

/**
 * Image-led tiles for Fluid's collection list: every collection that holds products, then every
 * top-level category that does. A collection or category keeps its own image; one without gets an
 * editorial cover, each tile a different one while they last.
 */
export async function getCollectionTiles(limit = 12): Promise<CollectionTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, categories, products] = await Promise.all([
		commerce.collectionBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
	]);
	const byId = new Map(categories.data.map((category) => [category.id, category]));
	const rootOf = (id: string, depth = 0): string => {
		const parentId = byId.get(id)?.parentId;
		return parentId && byId.has(parentId) && depth < 3 ? rootOf(parentId, depth + 1) : id;
	};
	const filledRoots = new Set(
		products.data.flatMap((product) => (product.category ? [rootOf(product.category.id)] : [])),
	);

	const entries = [
		...collections.data
			.filter(
				(collection) =>
					collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0,
			)
			.map((collection) => ({
				id: collection.id,
				key: collection.slug,
				href: `/collection/${collection.slug}`,
				name: collection.name,
				image: collection.image,
			})),
		...categories.data
			.filter((category) => !category.parentId && filledRoots.has(category.id))
			.map((category) => ({
				id: category.id,
				key: category.slug,
				href: `/category/${category.slug}`,
				name: category.name,
				image: category.image,
			})),
	].slice(0, limit);

	const imageless = entries.filter((entry) => !entry.image);
	return entries.map((entry) => {
		const index = imageless.indexOf(entry);
		const cover = (index >= 0 ? EDITORIAL.covers[index] : undefined) ?? listingCover(entry.key);
		return { id: entry.id, href: entry.href, name: entry.name, image: entry.image ?? cover.src };
	});
}
