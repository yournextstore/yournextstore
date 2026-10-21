import type { APICollectionGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
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
	const inline = node.type === "paragraph" || node.type === "heading";
	return children
		.filter(Boolean)
		.join(inline ? "" : " ")
		.trim();
}

export const firstStill = (images: readonly string[] | null | undefined) =>
	images?.find((image) => !isVideoUrl(image)) ?? null;

// One browse of the catalog backs every "no image of its own" fallback (collection and
// category tiles borrow their first product's photograph), so it is cached once and shared.
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return data;
}

/** Store name, tagline and the free-delivery threshold, formatted: the chrome's copy. */
export async function getStoreBasics() {
	"use cache";
	cacheLife("hours");
	const [me, { currency, locale }] = await Promise.all([meGetCached().catch(() => null), getStoreConfig()]);
	const settings = me?.store.settings;
	const threshold = settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : 0;
	return {
		storeName: me?.store.name || "Your Next Store",
		description: settings?.storeDescription?.trim() || null,
		freeShipping: threshold > 0 ? formatMoney({ amount: BigInt(threshold), currency, locale }) : null,
		contactForm: settings?.enabledTools?.contactForm ?? false,
		blog: settings?.enabledTools?.blog ?? false,
	};
}

export type ShowcaseTile = {
	id: string;
	name: string;
	href: string;
	image: string | null;
	description: string;
	count: number;
	/** The image is the collection's or category's own, not borrowed from a product. */
	ownImage: boolean;
};

/** Top-level categories that have products, each pictured by its own image or its first product's. */
export async function getCategoryTiles(limit: number): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, products] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const childrenOf = (id: string) => categories.data.filter((c) => c.parentId === id).map((c) => c.id);
	return categories.data
		.filter((category) => !category.parentId)
		.map((category) => {
			const ids = new Set([category.id, ...childrenOf(category.id)]);
			const members = products.filter((p) => p.category && ids.has(p.category.id));
			const product = members.find((p) => firstStill(p.images));
			return {
				id: category.id,
				name: category.name,
				href: `/category/${category.slug}`,
				image: category.image ?? firstStill(product?.images),
				description: richTextToPlain(category.description),
				count: members.length,
				ownImage: Boolean(category.image),
			};
		})
		.filter((tile) => tile.count > 0 && tile.image)
		.slice(0, limit);
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
		.filter((collection) => collection.active)
		.map((collection) => {
			const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
			const product = products.find((p) => memberIds.has(p.id) && firstStill(p.images));
			return {
				id: collection.id,
				name: collection.name,
				href: `/collection/${collection.slug}`,
				image: collection.image ?? firstStill(product?.images),
				description: richTextToPlain(collection.description),
				count: memberIds.size,
				ownImage: Boolean(collection.image),
			};
		})
		.filter((tile) => tile.count > 0 && tile.image)
		.slice(0, limit);
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

export type MenuItem = {
	id: string;
	slug: string;
	name: string;
	image: string | null;
	summary: string;
	badge: string | null;
	category: string | null;
	price: string | null;
	compareAt: string | null;
};

/** The admin's product badge is `{ content, textColor, backgroundColor }`; only its words are used. */
export function badgeText(badge: unknown): string | null {
	if (!badge || typeof badge !== "object" || !("content" in badge)) return null;
	const { content } = badge;
	return typeof content === "string" && content.trim() ? content.trim() : null;
}

type AnyProduct = Awaited<ReturnType<typeof getCatalogProducts>>[number];

/** A product as a menu line: price "from" the cheapest variant, struck-through list price on sale. */
export async function toMenuItem(product: AnyProduct): Promise<MenuItem> {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = product.variants ?? [];
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const { min, max } = priceRange(variants, taxBehavior);
	const cheapest = variants.find((v) => BigInt(displayPrice(v, taxBehavior)) === min);
	const list = cheapest ? displayPrice(cheapest, taxBehavior, "originalPrice") : null;
	const onSale = list !== null && BigInt(list) > min;
	return {
		id: product.id,
		slug: product.slug,
		name: product.name,
		image: firstStill(product.images),
		summary: typeof product.summary === "string" ? product.summary : "",
		badge: badgeText(product.badge),
		category: product.category?.name ?? null,
		price: variants.length === 0 ? null : min !== max ? `from ${fmt(min)}` : fmt(min),
		compareAt: onSale && list ? fmt(BigInt(list)) : null,
	};
}

/**
 * The home page's picks: a best-sellers collection when the store has one (any collection
 * whose slug says so), the newest products otherwise. The featured piece is the first of them
 * with a photograph; the selection lists the next six.
 */
export async function getHomeMenu(): Promise<{ special: MenuItem | null; menu: MenuItem[] }> {
	"use cache";
	cacheLife("minutes");
	const [collections, catalog] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	const bestSellerCollection = collections.data.find((c) => /best|popular|bestseller/i.test(c.slug));
	const collected = bestSellerCollection
		? await commerce
				.collectionGet({ idOrSlug: bestSellerCollection.slug })
				.then((collection) => (collection ? getCollectionProducts(collection) : []))
				.catch(() => [])
		: [];
	const collectedIds = new Set(collected.map((p) => p.id));
	const { taxBehavior } = await getStoreConfig();
	// Pictured and priced: a free or unpriced item would print "$0.00" as today's feature.
	const withImage = catalog.filter(
		(p) => firstStill(p.images) && p.variants.length > 0 && priceRange(p.variants, taxBehavior).min > 0n,
	);
	const specialProduct = withImage.find((p) => collectedIds.has(p.id)) ?? withImage[0] ?? null;
	const rest = [
		...withImage.filter((p) => collectedIds.has(p.id) && p.id !== specialProduct?.id),
		...withImage.filter((p) => !collectedIds.has(p.id) && p.id !== specialProduct?.id),
	];
	const [special, menu] = await Promise.all([
		specialProduct ? toMenuItem(specialProduct) : Promise.resolve(null),
		Promise.all(rest.slice(0, 6).map(toMenuItem)),
	]);
	return { special, menu };
}
