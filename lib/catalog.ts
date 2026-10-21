import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

type TaxBehavior = Awaited<ReturnType<typeof getStoreConfig>>["taxBehavior"];

import { isVideoUrl } from "@/lib/utils";

/** Flattens a TipTap document (or a plain string) into its visible text. */
export function richTextToPlain(value: unknown): string {
	if (typeof value === "string") return value.trim();
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

/** The store's name and one line about it, as the header, footer and hero print them. */
export async function getStoreBrand() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const name = me?.store.name || me?.store.settings?.storeName || "Your Next Store";
	const description = me?.store.settings?.storeDescription || "";
	const blog = me?.store.settings?.enabledTools?.blog ?? false;
	const contact = me?.store.settings?.enabledTools?.contactForm ?? false;
	// The small line under the wordmark: the store's own description when it is short enough to sit there.
	const tagline = description && description.length <= 48 ? description : "A low lamp, a good pour.";
	return { name, description, blog, contact, tagline };
}

/** One cached browse of the catalog backs every section that needs products or a fallback image. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data, meta } = await commerce
		.productBrowse({ active: true, limit: 100, orderBy: "createdAt", orderDirection: "desc" })
		.catch(() => ({ data: [], meta: { count: 0 } }));
	return { products: data, total: meta.count };
}

export type ShowcaseTile = {
	id: string;
	name: string;
	slug: string;
	href: string;
	image: string | null;
	description: string;
	count: number;
};

/** Active collections with products, pictured by their own image or their first product's. */
export async function getCollectionTiles(limit = 50): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, { products }] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCatalogProducts(),
	]);
	return collections.data
		.filter((collection) => collection.active)
		.map((collection) => {
			const memberIds = new Set(collection.productCollections.map((pc) => pc.productId));
			const members = products.filter((p) => memberIds.has(p.id));
			return {
				id: collection.id,
				name: collection.name,
				slug: collection.slug,
				href: `/collection/${collection.slug}`,
				image: collection.image ?? firstStill(members[0]?.images),
				description: richTextToPlain(collection.description),
				count: members.length,
			};
		})
		.filter((tile) => tile.count > 0 && tile.image)
		.slice(0, limit);
}

/** Top-level categories that have products, with how many each holds. */
export async function getCategoryTiles(limit = 50): Promise<ShowcaseTile[]> {
	"use cache";
	cacheLife("minutes");
	const [categories, { products }] = await Promise.all([
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
				slug: category.slug,
				href: `/category/${category.slug}`,
				image: category.image ?? firstStill(members[0]?.images),
				description: richTextToPlain(category.description),
				count: members.length,
			};
		})
		.filter((tile) => tile.count > 0)
		.slice(0, limit);
}

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	tiktok: "TikTok",
	linkedin: "LinkedIn",
} as const;

export type SocialLink = { key: keyof typeof SOCIAL_LABELS; label: string; href: string };

/** The store's configured social profiles, in the original footer's order. */
export async function getSocialLinks(): Promise<SocialLink[]> {
	"use cache";
	cacheLife("hours");
	const socials = await commerce.socialsGet().catch(() => null);
	if (!socials) return [];
	return (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[]).flatMap((key) => {
		const href = socials.socials[key];
		return href ? [{ key, label: SOCIAL_LABELS[key], href }] : [];
	});
}

type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>["products"][number];

/** The product's lowest display price in minor units (net or gross per the store's tax behaviour). */
async function minPriceOf(product: CatalogProduct): Promise<bigint | null> {
	const { taxBehavior } = await getStoreConfig();
	// Free set/bundle shells (price "0") would print "from $0.00": only priced variants count.
	const priced = (product.variants ?? []).filter((variant) => Number(variant.price) > 0);
	if (priced.length === 0) return null;
	return priceRange(priced, taxBehavior).min;
}

/** The masthead's numbers, from the catalogue: pieces, shelves (categories) and the price span. */
export async function getShelfStats() {
	"use cache";
	cacheLife("minutes");
	const [{ products, total }, categories, { currency, locale }] = await Promise.all([
		getCatalogProducts(),
		getCategoryTiles(50),
		getStoreConfig(),
	]);
	const prices = (await Promise.all(products.map(minPriceOf)))
		.filter((price): price is bigint => price !== null)
		.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const low = prices[0];
	const high = prices.at(-1);
	return {
		pieces: total,
		shelves: categories.length,
		from: low !== undefined ? fmt(low) : null,
		to: high !== undefined && high !== low ? fmt(high) : null,
	};
}

export type ShelfItem = {
	id: string;
	name: string;
	href: string;
	note: string;
	price: string;
	image: string | null;
	badge: { label: string; tone: "gold" | "rust" | "muted" } | null;
};

export type PriceShelf = {
	name: string;
	href: string;
	items: ShelfItem[];
};

const SHELF_NAMES = ["Small Finds", "House Favourites", "Top Shelf"] as const;
const FEW_LEFT = 5;

/** A menu-card badge from the data: on sale (terracotta), few left (brass), sold out (muted). */
function badgeOf(product: CatalogProduct, taxBehavior: TaxBehavior): ShelfItem["badge"] {
	const variants = product.variants ?? [];
	const tracked = variants.length > 0 && variants.every((v) => typeof v.stock === "number");
	const stock = tracked ? variants.reduce((sum, v) => sum + (v.stock ?? 0), 0) : null;
	if (stock === 0) return { label: "Sold out", tone: "muted" };
	const onSale = variants.some((v) => {
		const list = displayPrice(v, taxBehavior, "originalPrice");
		return Boolean(list) && BigInt(list ?? 0) > BigInt(displayPrice(v, taxBehavior));
	});
	if (onSale) return { label: "⟡ On sale", tone: "rust" };
	if (stock !== null && stock <= FEW_LEFT) return { label: "★ Few left", tone: "gold" };
	return null;
}

/**
 * The original's three menu cards, filled from the real catalogue: its lower, middle
 * and upper third by price, four pieces each, every card linking to that price band of the listing.
 */
export async function getPriceShelves(): Promise<PriceShelf[]> {
	"use cache";
	cacheLife("minutes");
	const [{ products }, { currency, locale, taxBehavior }] = await Promise.all([
		getCatalogProducts(),
		getStoreConfig(),
	]);
	const priced = (
		await Promise.all(products.map(async (product) => ({ product, price: await minPriceOf(product) })))
	)
		.filter((entry): entry is { product: CatalogProduct; price: bigint } => entry.price !== null)
		.sort((a, b) => (a.price < b.price ? -1 : a.price > b.price ? 1 : 0));
	if (priced.length === 0) return [];
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const toItem = ({ product, price }: { product: CatalogProduct; price: bigint }): ShelfItem => ({
		id: product.id,
		name: product.name,
		href: `/product/${product.slug}`,
		note: product.summary?.trim() || product.category?.name || "",
		price: fmt(price),
		image: firstStill(product.images),
		badge: badgeOf(product, taxBehavior),
	});

	if (priced.length < 6) {
		return [{ name: "The Shelf", href: "/products", items: priced.slice(0, 6).map(toItem) }];
	}

	const size = Math.ceil(priced.length / 3);
	const bands = [priced.slice(0, size), priced.slice(size, size * 2), priced.slice(size * 2)];
	return bands.flatMap((band, index) => {
		const first = band[0];
		const last = band.at(-1);
		const name = SHELF_NAMES[index];
		if (!first || !last || !name) return [];
		const params = new URLSearchParams();
		if (index > 0) params.set("priceMin", String(first.price));
		if (index < 2) params.set("priceMax", String(last.price));
		params.set("sort", "price-asc");
		// The top shelf leads with its dearest pieces, the others with their cheapest.
		const picks = index === 2 ? [...band].reverse() : band;
		return [{ name, href: `/products?${params.toString()}`, items: picks.slice(0, 4).map(toItem) }];
	});
}

/** Bundled store photographs (see NOTICE.md) for the gallery and story frames: a warm, low-lit bar. */
export const ROOM_PHOTOS = [
	{
		src: "/images/pexels/room-leather-bag.jpg",
		alt: "A glass of whiskey and a candle on a dark wooden bar top",
	},
	{
		src: "/images/pexels/room-lamp-cabinet.jpg",
		alt: "A brass lamp on the back bar beside shelves of bottles",
	},
	{ src: "/images/pexels/room-sunglasses.jpg", alt: "A coupe cocktail with a lemon twist on a polished bar" },
	{ src: "/images/pexels/room-warm-shelves.jpg", alt: "Wooden shelves of bottles under hanging bulbs" },
	{ src: "/images/pexels/room-pottery.jpg", alt: "Oak casks stacked in a brick cellar" },
	{ src: "/images/pexels/room-living.jpg", alt: "A quiet bar room with leather booths and candles" },
] as const;

export const SHELF_PHOTO = "/images/pexels/shelf-lamps.jpg";
export const COLLECTION_PHOTO = "/images/pexels/collection-shelves.jpg";

export const pieces = (count: number) => (count === 1 ? "1 item" : `${count} items`);
