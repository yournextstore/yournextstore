import type { APICollectionGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";
import { encodeVts } from "@/lib/vts";

/** Flattens a TipTap document (or a plain string) into its visible text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object") return "";
	const node = value as { type?: unknown; text?: unknown; content?: unknown };
	if (typeof node.text === "string") return node.text;
	const children = Array.isArray(node.content) ? node.content.map(richTextToPlain) : [];
	const inline = node.type === "paragraph" || node.type === "heading";
	return children
		.filter(Boolean)
		.join(inline ? "" : " ")
		.trim();
}

/**
 * A browsed collection that can show products: hand-picked members or metafield rules. An empty
 * manual collection stays out of the menu and link lists, so no link leads to an empty page.
 */
export const collectionHasProducts = (collection: {
	active: boolean;
	productCollections: readonly unknown[];
	metafieldRules?: readonly unknown[] | null;
}) =>
	collection.active &&
	(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0);

/** "7 pieces" */
export const pieces = (count: number) => `${count} ${count === 1 ? "piece" : "pieces"}`;

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Only a `manual` collection keeps its members in the join table that `collectionGet` returns —
// the smart filters are evaluated against the whole catalog when the storefront asks for them.
// Re-expressing each one as the equivalent product browse is what keeps those collections from
// rendering as an empty grid. Cached like the collection itself, which also pins the
// `Date.now()` below to the cache entry.
export async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	"use cache";
	cacheLife("minutes");
	const { filter } = collection;

	if (filter.type === "manual") {
		const ids = collection.productCollections.map((pc) => pc.product.id);
		// The SDK throws on a 404: one product deleted since it joined must not fail the page.
		return (
			await Promise.all(ids.map((id) => commerce.productGet({ idOrSlug: id }).catch(() => null)))
		).filter((product) => product !== null);
	}

	if (filter.type === "variantValues") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			vts: encodeVts(filter.values),
		});
		return data;
	}

	if (filter.type === "dynamicPrice") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			priceMin: filter.min ?? undefined,
			priceMax: filter.max ?? undefined,
		});
		return data;
	}

	const { data } = await commerce.productBrowse({
		active: true,
		limit: SMART_COLLECTION_LIMIT,
		orderBy: "createdAt",
		orderDirection: "desc",
	});

	// A rolling "new arrivals" window has no browse equivalent, so the age bound is applied here.
	if (typeof filter.days !== "number") {
		return data;
	}
	const cutoff = Date.now() - filter.days * MS_PER_DAY;
	return data.filter((product) => new Date(product.createdAt).getTime() >= cutoff);
}

// The SDK throws on a 404 despite its `| null` type.
export const getCollectionData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, collection] = await try_(commerce.collectionGet({ idOrSlug: slug }));
	return error ? null : collection;
};

export type Product = Awaited<ReturnType<typeof getCollectionProducts>>[number];

/** The home page's rows: each active collection with its products, the ones with none left out. */
export async function getCollectionRows(limit: number) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] }));
	const rows = await Promise.all(
		data
			.filter((collection) => collection.active)
			.slice(0, limit)
			.map(async (summary) => {
				const collection = await getCollectionData(summary.slug);
				if (!collection) return null;
				const products = await getCollectionProducts(collection);
				return {
					id: collection.id,
					name: collection.name,
					href: `/collection/${collection.slug}`,
					description: richTextToPlain(collection.description),
					products,
				};
			}),
	);
	return rows.filter((row) => row !== null && row.products.length > 0).flatMap((row) => (row ? [row] : []));
}

export async function getLatestProducts(limit: number) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] }));
	return data;
}

export type CategoryTile = { id: string; name: string; href: string; image: string | null };

/** Top-level categories that have products, each pictured by its own image or its first product's. */
export async function getCategoryTiles(limit: number): Promise<CategoryTile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
	]);
	return categories.data
		.filter((category) => !category.parentId)
		.flatMap((category) => {
			const members = products.data.filter((p) => p.category?.id === category.id);
			// The first photographed product (variant photos count), so a tile is never blank.
			const image =
				category.image ??
				members
					.map((p) => firstStill(p.images) ?? firstStill(p.variants.flatMap((v) => v.images ?? [])))
					.find((still) => still !== null) ??
				null;
			return members.length > 0 && image
				? [{ id: category.id, name: category.name, href: `/category/${category.slug}`, image }]
				: [];
		})
		.slice(0, limit);
}
