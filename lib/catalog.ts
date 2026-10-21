import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

export type CatalogProduct = APIProductsBrowseResult["data"][number];

export type CategoryLink = {
	id: string;
	name: string;
	slug: string;
	href: string;
};

/** Category and store names arrive as typed by the merchant, sometimes in lower case; menus want a capital. */
export const sentenceCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

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

/** First photograph (not a video) in a media list. */
export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

/**
 * The "worn" shot of a product: catalogues usually lead with a packshot and follow with
 * photographs on a model, so the editorial slots prefer the second still.
 */
export const wornStill = (images: readonly string[] | null | undefined) => {
	const stills = images?.filter((image) => !isVideoUrl(image)) ?? [];
	return stills[1] ?? stills[0] ?? null;
};

// A sale, outlet or last-chance category earns the lilac "Last Chance" slot in the masthead.
const LAST_CHANCE = /outlet|sale|last chance|promo|archive/i;

/** Every active product, newest first. Backs the home page, menus and editorial tiles. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit: 100, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [] as CatalogProduct[] }));
	return data;
}

/** Top-level categories that actually hold products, in the merchant's order. */
export async function getCategories(): Promise<CategoryLink[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const stocked = new Set(products.map((p) => p.category?.id).filter(Boolean));
	return categories.data
		.filter((category) => !category.parentId && stocked.has(category.id))
		.map((category) => ({
			id: category.id,
			name: sentenceCase(category.name),
			slug: category.slug,
			href: `/category/${category.slug}`,
		}));
}

export type HeaderData = {
	storeName: string;
	tagline: string | null;
	categories: CategoryLink[];
	lastChance: CategoryLink | null;
	blogEnabled: boolean;
};

export async function getHeaderData(): Promise<HeaderData> {
	"use cache";
	cacheLife("hours");
	const [me, categories] = await Promise.all([meGetCached().catch(() => null), getCategories()]);
	const description = me?.store.settings?.storeDescription?.trim() ?? "";
	return {
		storeName: me?.store.name || "Your Next Store",
		// The wordmark carries a one-line strap only when the store description is short enough to be one.
		tagline: description && description.length <= 32 ? description : null,
		categories,
		lastChance: categories.find((category) => LAST_CHANCE.test(category.name)) ?? null,
		blogEnabled: me?.store.settings?.enabledTools?.blog ?? false,
	};
}

export type EditorialTile = {
	id: string;
	name: string;
	href: string;
	image: string;
	count: number;
};

/**
 * Categories pictured by a worn shot of their newest product. A store with fewer than four
 * stocked categories is topped up with its collections, so the four-up row stays full.
 */
export async function getCategoryTiles(): Promise<EditorialTile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products, collections] = await Promise.all([
		getCategories(),
		getCatalogProducts(),
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
	]);
	const categoryTiles = categories.flatMap((category) => {
		const members = products.filter((p) => p.category?.id === category.id);
		const pictured = members.find((p) => wornStill(p.images)) ?? null;
		const image = pictured ? wornStill(pictured.images) : null;
		return image
			? [{ id: category.id, name: category.name, href: category.href, image, count: members.length }]
			: [];
	});
	if (categoryTiles.length >= 4) return categoryTiles;
	const collectionTiles = await Promise.all(
		collections.data
			.filter((collection) => collection.active)
			.map(async (collection) => {
				const { data, meta } = await commerce
					.productBrowse({ active: true, collection: collection.slug, limit: 8 })
					.catch(() => ({ data: [] as CatalogProduct[], meta: { count: 0 } }));
				const image = collection.image ?? data.map((p) => wornStill(p.images)).find(Boolean) ?? null;
				return image && meta.count > 0
					? [
							{
								id: collection.id,
								name: sentenceCase(collection.name),
								href: `/collection/${collection.slug}`,
								image,
								count: meta.count,
							},
						]
					: [];
			}),
	);
	return [...categoryTiles, ...collectionTiles.flat()];
}
