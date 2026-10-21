import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
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

/**
 * Editorial photographs (Pexels, see NOTICE.md) for the hero slides, the "Made to match" card,
 * the about page and the category circles. Product cards, product pages and the cart keep the
 * store's own photos.
 */
export const EDITORIAL = {
	hero: [
		"/images/pexels/bb-hero-bed.jpg",
		"/images/pexels/bb-hero-camera.jpg",
		"/images/pexels/bb-hero-picnic.jpg",
	],
	set: "/images/pexels/bb-set-sweaters.jpg",
	about: "/images/pexels/bb-about-pouch.jpg",
} as const;

const CATEGORY_PHOTOS: [RegExp, string][] = [
	[/bag|accessor|glass|belt|wallet|jewel|watch|hat|tote/i, "/images/pexels/bb-cat-bag.jpg"],
	[/apparel|cloth|wear|shirt|hood|dress|trouser|jacket|fashion|knit/i, "/images/pexels/bb-cat-knit.jpg"],
	[/digital|book|music|record|print|art|media|download|photo|camera/i, "/images/pexels/bb-cat-camera.jpg"],
];

/** A circle photo chosen by what the category name sounds like, so no store slug is hardcoded. */
export function categoryPhoto(name: string) {
	return CATEGORY_PHOTOS.find(([pattern]) => pattern.test(name))?.[1] ?? "/images/pexels/bb-cat-pouch.jpg";
}

/** Products with a photo and a price above zero first, so rows never open on a blank or $0 card. */
export function picturedFirst<T extends { images?: string[] | null; variants?: { price: string }[] | null }>(
	products: T[],
) {
	const ready = (product: T) =>
		(product.images?.length ?? 0) > 0 &&
		(product.variants ?? []).some((variant) => Number(variant.price) > 0);
	return [...products.filter(ready), ...products.filter((product) => !ready(product))];
}

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
	const tagline = description && description.length <= 32 ? description : "Soft clothes for little ones";
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
				image: category.image ?? categoryPhoto(category.name),
				description: richTextToPlain(category.description),
				count: members.length,
			};
		})
		.filter((tile) => tile.count > 0)
		.slice(0, limit);
}

/** The collection the home page and the bar above the header feature: the first with an image of its own. */
export async function getFeaturedCollection() {
	"use cache";
	cacheLife("minutes");
	const [collections, tiles] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCollectionTiles(),
	]);
	const withImage = collections.data.find(
		(collection) => collection.active && collection.image && tiles.some((t) => t.id === collection.id),
	);
	return tiles.find((tile) => tile.id === withImage?.id) ?? tiles[0] ?? null;
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

/**
 * The "Made to match" set on the home page: the first collection with three or more pieces,
 * else the fullest category, else simply the newest pieces.
 */
export async function getMatchingSet() {
	"use cache";
	cacheLife("minutes");
	const [collections, categories, { products }] = await Promise.all([
		commerce.collectionBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		getCategoryTiles(),
		getCatalogProducts(),
	]);
	const collection = collections.data.find(
		(c) =>
			c.active &&
			products.filter((p) => c.productCollections.some((pc) => pc.productId === p.id)).length >= 3,
	);
	if (collection) {
		const members = picturedFirst(
			products.filter((p) => collection.productCollections.some((pc) => pc.productId === p.id)),
		);
		return {
			name: collection.name,
			href: `/collection/${collection.slug}`,
			image: EDITORIAL.set,
			products: members.slice(0, 3),
		};
	}
	const category = [...categories].sort((a, b) => b.count - a.count)[0];
	if (category && category.count >= 2) {
		const members = picturedFirst(products.filter((p) => p.category?.id === category.id));
		return {
			name: category.name,
			href: category.href,
			image: EDITORIAL.set,
			products: members.slice(0, 3),
		};
	}
	return {
		name: "New arrivals",
		href: "/products",
		image: EDITORIAL.set,
		products: picturedFirst(products).slice(0, 3),
	};
}

export const pieces = (count: number) => (count === 1 ? "1 piece" : `${count} pieces`);
