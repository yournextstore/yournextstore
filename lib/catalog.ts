import type { APICollectionGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
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

/** A product's first still, falling back to its variants' photographs. */
const productStill = (product: {
	images?: readonly string[] | null;
	variants?: readonly { images?: readonly string[] | null }[];
}) => firstStill(product.images) ?? firstStill((product.variants ?? []).flatMap((v) => v.images ?? []));

/** The first still among `products`, so a tile is never pictured by an imageless product. */
const firstProductStill = (products: Parameters<typeof productStill>[0][]) =>
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

/** Active collections with an image of their own or, failing that, one of their products'. */
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
 * Each top-level category's position, which picks its family dot colour (woody, floral, citrus,
 * oud in turn). Same order as the Shop menu, so a category keeps its colour everywhere.
 */
export async function getCategoryTones(): Promise<Record<string, number>> {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.categoriesBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] }));
	return Object.fromEntries(
		data.filter((category) => !category.parentId).map((category, index) => [category.id, index]),
	);
}

export type Notes = { top: string; heart: string; base: string };

/**
 * The original's notes pyramid, read from product copy written as
 * "Top: …. Heart: …. Base: …." (the convention fragrance descriptions already follow).
 */
export function parseNotes(content: unknown): Notes | null {
	const text = richTextToPlain(content);
	const match = text.match(/Top:\s*([^.]+)\.\s*Heart:\s*([^.]+)\.\s*Base:\s*([^.]+)\./i);
	if (!match?.[1] || !match[2] || !match[3]) return null;
	const tidy = (value: string) => {
		const trimmed = value.trim();
		return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
	};
	return { top: tidy(match[1]), heart: tidy(match[2]), base: tidy(match[3]) };
}

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

export type ShowcaseProduct = {
	id: string;
	slug: string;
	name: string;
	image: string | null;
	summary: string;
	notes: Notes | null;
	category: string | null;
	tone: number | undefined;
	priceFrom: string | null;
	soldOut: boolean;
};

/**
 * The home page's scents: a best-sellers collection when the store has one (any collection
 * whose slug says so), the newest products otherwise. The hero features the first one whose
 * copy carries a notes pyramid, as the original features a signature scent.
 */
export async function getHomeProducts(): Promise<{
	featured: ShowcaseProduct | null;
	bestSellers: ShowcaseProduct[];
}> {
	"use cache";
	cacheLife("minutes");
	const [collections, catalog, tones, { currency, locale, taxBehavior }] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
		getCategoryTones(),
		getStoreConfig(),
	]);
	const bestSellerCollection = collections.data.find((c) => /best|popular|bestseller/i.test(c.slug));
	const collected = bestSellerCollection
		? await commerce
				.collectionGet({ idOrSlug: bestSellerCollection.slug })
				.then((collection) => (collection ? getCollectionProducts(collection) : []))
				.catch(() => [])
		: [];
	// Photographed products first, then those that can be bought at a price, so the hero card and
	// the bento never open on an empty frame or a sold-out piece.
	const rank = (product: (typeof catalog)[number]) => {
		const variants = "variants" in product ? product.variants : [];
		const buyable =
			variants.some((v) => v.stock === null || v.stock > 0) &&
			variants.length > 0 &&
			priceRange(variants, taxBehavior).min > 0n;
		return (productStill(product) === null ? 2 : 0) + (buyable ? 0 : 1);
	};
	const ranked = (list: typeof catalog) =>
		list
			.map((product, index) => ({ product, index, score: rank(product) }))
			.sort((x, y) => x.score - y.score || x.index - y.index)
			.map(({ product }) => product);
	const source = ranked(collected.length >= 2 ? collected : catalog);

	const toShowcase = (product: (typeof source)[number]): ShowcaseProduct => {
		const variants = "variants" in product ? product.variants : [];
		const { min } = priceRange(variants, taxBehavior);
		const multiple = new Set(variants.map((v) => v.price)).size > 1;
		const amount = variants.length > 0 ? formatMoney({ amount: min, currency, locale }) : null;
		const categoryId = "category" in product ? product.category?.id : undefined;
		return {
			id: product.id,
			slug: product.slug,
			name: product.name,
			image: productStill(product),
			summary: "summary" in product && typeof product.summary === "string" ? product.summary : "",
			notes: parseNotes("content" in product ? product.content : null),
			category: "category" in product ? (product.category?.name ?? null) : null,
			tone: categoryId ? tones[categoryId] : undefined,
			priceFrom: amount ? (multiple ? `From ${amount}` : amount) : null,
			soldOut: variants.length > 0 && variants.every((v) => v.stock === 0),
		};
	};

	const bestSellers = source.slice(0, 4).map(toShowcase);
	const withNotes = [...source, ...catalog].find((product) =>
		parseNotes("content" in product ? product.content : null),
	);
	return {
		featured: withNotes ? toShowcase(withNotes) : (bestSellers[0] ?? null),
		bestSellers,
	};
}
