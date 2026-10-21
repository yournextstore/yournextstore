import type { APICollectionGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { encodeVts } from "@/lib/vts";

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

// One cached browse of the catalog backs the category checks and the home fallback rows.
export async function getCatalogProducts() {
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
	image: string;
	description: string;
};

/**
 * Editorial photography (Pexels, see NOTICE.md) for the lifestyle slots: hero, the collection
 * feature, the media blocks, the About square and the tall collection tiles. Product cards and
 * product pages keep the store's own photos.
 */
export const EDITORIAL = {
	hero: "/images/pexels/hero.jpg",
	feature: "/images/pexels/feature.jpg",
	media: "/images/pexels/media.jpg",
	about: "/images/pexels/about.jpg",
	tiles: [
		"/images/pexels/tile-1.jpg",
		"/images/pexels/tile-2.jpg",
		"/images/pexels/tile-3.jpg",
		"/images/pexels/tile-4.jpg",
	],
} as const;

export const editorialTile = (index: number) =>
	EDITORIAL.tiles[index % EDITORIAL.tiles.length] ?? EDITORIAL.hero;

/** Collections that would open an empty page (a manual collection with no members) are skipped. */
function collectionHasProducts(collection: {
	productCollections?: unknown[] | null;
	metafieldRules?: unknown[] | null;
	filter?: { type?: string } | null;
}) {
	if (collection.filter && collection.filter.type !== "manual") return true;
	return (collection.productCollections?.length ?? 0) > 0 || (collection.metafieldRules?.length ?? 0) > 0;
}

/** Active collections that hold products, in the store's order. */
export async function getBrowsableCollections() {
	"use cache";
	cacheLife("minutes");
	const collections = await commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] }));
	return collections.data.filter((collection) => collection.active && collectionHasProducts(collection));
}

/**
 * "Shop our collections" tiles: the collections that hold products, then the top-level categories
 * that do, each over one of the editorial photographs.
 */
export async function getCollectionTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, categories, products] = await Promise.all([
		getBrowsableCollections(),
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const entries = [
		...collections.map((collection) => ({
			id: collection.id,
			name: collection.name,
			href: `/collection/${collection.slug}`,
			description: richTextToPlain(collection.description),
		})),
		...categories.data
			.filter((category) => !category.parentId && products.some((p) => p.category?.id === category.id))
			.map((category) => ({
				id: category.id,
				name: category.name,
				href: `/category/${category.slug}`,
				description: richTextToPlain(category.description),
			})),
	];
	return entries.slice(0, limit).map((entry, index) => ({ ...entry, image: editorialTile(index) }));
}

/** Products with a photograph first, so rows never open on an empty frame. */
export function photographedFirst<T extends { images?: readonly string[] | null }>(products: T[]): T[] {
	const pictured = (product: T) => Boolean(firstStill(product.images));
	return [...products.filter(pictured), ...products.filter((product) => !pictured(product))];
}

export type NavCategory = {
	id: string;
	name: string;
	href: string;
	children: { id: string; name: string; href: string }[];
};

/** Top-level categories with their direct children, for the Shop mega menu and the mobile drawer. */
export async function getNavCategories(): Promise<NavCategory[]> {
	"use cache";
	cacheLife("minutes");
	const categories = await commerce
		.categoriesBrowse({ active: true, limit: 100 })
		.catch(() => ({ data: [] }));
	const all = categories.data;
	return all
		.filter((category) => !category.parentId)
		.map((category) => ({
			id: category.id,
			name: category.name,
			href: `/category/${category.slug}`,
			children: all
				.filter((child) => child.parentId === category.id)
				.map((child) => ({
					id: child.id,
					name: child.name,
					href: `/category/${category.slug}/${child.slug}`,
				})),
		}));
}

/** The store's display name (settings first: `store.name` is often the slug). */
export async function getStoreName(): Promise<string> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Store";
}

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

type Collection = APICollectionGetByIdResult;

/** A collection's products. Only a `manual` collection keeps its members in the join table that
 *  `collectionGet` returns; smart filters are re-expressed as the equivalent product browse. */
export async function getCollectionProducts(collection: Collection) {
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

/** The SDK throws on a 404 despite its `| null` type. */
export async function getCollectionData(slug: string) {
	"use cache";
	cacheLife("minutes");
	const [error, collection] = await try_(commerce.collectionGet({ idOrSlug: slug }));
	return error ? null : collection;
}

/** Home rows: the store's collections that have products, each with its products (pictured first). */
export async function getHomeCollections() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] }));
	const full = await Promise.all(
		data.filter((c) => c.active).map((c) => getCollectionData(c.slug).catch(() => null)),
	);
	const entries = await Promise.all(
		full
			.filter((collection) => collection !== null)
			.map(async (collection) => ({
				collection,
				products: await getCollectionProducts(collection).catch(() => []),
			})),
	);
	return entries
		.filter((entry) => entry.products.length > 0)
		.map((entry) => ({ ...entry, products: photographedFirst([...entry.products]) }));
}

/** Pink announcement bar copy from the store's own free-shipping threshold, if it has one. */
export async function getAnnouncement(): Promise<string | null> {
	"use cache";
	cacheLife("hours");
	const [me, config] = await Promise.all([meGetCached().catch(() => null), getStoreConfig()]);
	const threshold = Number(me?.store.settings?.freeShippingThreshold ?? 0);
	if (!threshold) return null;
	return `Free shipping on orders over ${formatMoney({ amount: BigInt(threshold), currency: config.currency, locale: config.locale })}`;
}
