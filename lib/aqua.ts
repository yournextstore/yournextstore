import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";

// Plain module: cached reads shared by the chrome and the home page. Nothing here may cross a
// "use client" boundary as a value other than the plain data it returns.

/** The whole catalogue in one cached browse: tiles and editorial slots borrow photos from it. */
export async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data, meta } = await commerce
		.productBrowse({ active: true, limit: 100 })
		.catch(() => ({ data: [], meta: { count: 0 } }));
	return { products: data, count: meta.count };
}

const SOCIAL_LABELS: Record<string, string> = {
	email: "Email",
	instagram: "Instagram",
	linkedin: "LinkedIn",
	x: "X",
	facebook: "Facebook",
	youtube: "YouTube",
	tiktok: "TikTok",
};

/** Store name, description, socials, enabled tools and the free-shipping threshold, formatted. */
export async function getStoreBasics() {
	"use cache";
	cacheLife("hours");
	const [me, { currency, locale }, socials] = await Promise.all([
		meGetCached().catch(() => null),
		getStoreConfig(),
		commerce.socialsGet().catch(() => null),
	]);
	const settings = me?.store.settings;
	const threshold = settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : 0;
	return {
		storeName: settings?.storeName || me?.store.name || "Your Next Store",
		description: settings?.storeDescription?.trim() || null,
		freeShippingMinor: threshold > 0 ? threshold : null,
		freeShipping: threshold > 0 ? formatMoney({ amount: BigInt(threshold), currency, locale }) : null,
		contactForm: settings?.enabledTools?.contactForm ?? false,
		newsletter: settings?.enabledTools?.newsletter ?? false,
		blog: settings?.enabledTools?.blog ?? false,
		socials: Object.entries(socials?.socials ?? {})
			.filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].length > 0)
			.map(([network, href]) => ({
				label: SOCIAL_LABELS[network] ?? network,
				href: network === "email" && !href.startsWith("mailto:") ? `mailto:${href}` : href,
			})),
	};
}

export type CategoryTile = {
	slug: string;
	name: string;
	href: string;
	image: string | null;
	count: number;
};

/** Top-level categories with a product count and a photo (their own, else their first product's). */
export async function getCategoryTiles(): Promise<CategoryTile[]> {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] }));
	const top = data.filter((category) => !category.parentId);
	const tiles = await Promise.all(
		top.map(async (category, index) => {
			const browse = await commerce
				.productBrowse({ active: true, limit: 1, category: category.slug })
				.catch(() => ({ data: [], meta: { count: 0 } }));
			return {
				slug: category.slug,
				name: category.name,
				href: `/category/${category.slug}`,
				image: category.image ?? editorialPhoto(category.name, index),
				count: browse.meta.count,
			};
		}),
	);
	return tiles.filter((tile) => tile.count > 0);
}

/**
 * Editorial photographs (see NOTICE.md) for the hero and category tiles. A tile picks a
 * photo by what its category name sounds like, so any store's categories land on a fitting
 * picture without hardcoded slugs; product cards and pages keep the store's own photos.
 */
export const HERO_PHOTO = "/images/pexels/aq-hero-lamps.jpg";

const CATEGORY_PHOTOS: [RegExp, string][] = [
	[/hardscape|stone|rock|wood|tool/i, "/images/pexels/aq-cat-leather.jpg"],
	[/plant|moss|fern|stem|flora/i, "/images/pexels/aq-cat-apparel.jpg"],
	[/light|lamp|led|co2/i, "/images/pexels/aq-cat-records.jpg"],
];
const FALLBACK_PHOTOS = ["/images/pexels/aq-lamp-room.jpg", "/images/pexels/aq-dark-water.jpg"];

export function editorialPhoto(name: string, index: number) {
	const match = CATEGORY_PHOTOS.find(([pattern]) => pattern.test(name));
	return match
		? match[1]
		: (FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length] ?? "/images/pexels/aq-lamp-room.jpg");
}

type CollectionLike = { productCollections?: unknown[] | null; metafieldRules?: unknown };

/** A manual collection without members (or a rule collection without rules) would open an empty page. */
export function hasMembers(collection: CollectionLike) {
	const rules = collection.metafieldRules;
	return (collection.productCollections?.length ?? 0) > 0 || (Array.isArray(rules) && rules.length > 0);
}

/** Products with a photo and a price above zero first, so rails never open on a blank or $0 card. */
export function picturedFirst<T extends { images?: string[] | null; variants?: { price: string }[] | null }>(
	products: T[],
) {
	const ready = (product: T) =>
		(product.images?.length ?? 0) > 0 &&
		(product.variants ?? []).some((variant) => Number(variant.price) > 0);
	return [...products.filter(ready), ...products.filter((product) => !ready(product))];
}

/** Lower-case a catalogue name for running copy, unless it reads as an acronym or brand caps. */
export function inSentence(name: string) {
	return name
		.split(" ")
		.map((word) => (/[A-Z].*[A-Z0-9]/.test(word) && word === word.toUpperCase() ? word : word.toLowerCase()))
		.join(" ");
}

/** Plain text of a TipTap document (collection and category descriptions are rich text). */
export function richText(value: unknown): string | null {
	if (typeof value === "string") return value.trim() || null;
	const walk = (node: unknown): string => {
		if (!node || typeof node !== "object") return "";
		const text = "text" in node && typeof node.text === "string" ? node.text : "";
		const content = "content" in node && Array.isArray(node.content) ? node.content : [];
		return text + content.map(walk).join(content.length > 1 ? " " : "");
	};
	return walk(value).replace(/\s+/g, " ").trim() || null;
}
