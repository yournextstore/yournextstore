import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { commerce, meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";

/** Store identity for the chrome: display name, tagline, free-shipping line and optional tools. */
export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");

	const [error, me] = await try_(meGetCached());
	if (error) {
		return {
			name: "Your Next Store",
			description: null,
			freeShipping: null,
			freeShippingThreshold: null,
			blogEnabled: false,
			contactEnabled: false,
			newsletterEnabled: false,
		};
	}
	const settings = me.store.settings;
	const threshold = settings?.freeShippingThreshold ? BigInt(settings.freeShippingThreshold) : null;
	const { currency, locale } = await getStoreConfig();

	return {
		name: settings?.storeName || me.store.name || "Your Next Store",
		description: settings?.storeDescription || null,
		freeShipping: threshold && threshold > 0n ? formatMoney({ amount: threshold, currency, locale }) : null,
		freeShippingThreshold: threshold && threshold > 0n ? threshold.toString() : null,
		blogEnabled: settings?.enabledTools?.blog ?? false,
		contactEnabled: settings?.enabledTools?.contactForm ?? false,
		newsletterEnabled: settings?.enabledTools?.newsletter ?? false,
	};
}

/** Category names are stored as typed in the admin; take the last path segment and capitalise. */
export function displayName(name: string) {
	const last = name.split(">").at(-1)?.trim() ?? name;
	return last.charAt(0).toUpperCase() + last.slice(1);
}

/** Collection and category descriptions are TipTap JSON (or plain strings): flatten to one line. */
export function plainText(value: unknown): string {
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.startsWith("{")) {
			try {
				return plainText(JSON.parse(trimmed) as unknown);
			} catch {
				return trimmed;
			}
		}
		return trimmed;
	}
	if (!value || typeof value !== "object") return "";
	if ("text" in value && typeof value.text === "string") return value.text;
	if ("content" in value && Array.isArray(value.content)) {
		return value.content
			.map((child: unknown) => plainText(child))
			.filter(Boolean)
			.join(" ")
			.replace(/\s+/g, " ")
			.trim();
	}
	return "";
}

/**
 * Editorial photography (Pexels, see NOTICE.md) for the original's room slots: hero slides,
 * the "Explore collections" mosaic, the shop-the-look photos, image-with-text and the dark tab
 * band. Product cards, the featured buy box and product pages keep the store's own photos.
 */
export const EDITORIAL = {
	hero: ["/images/pexels/hero-1.jpg", "/images/pexels/hero-2.jpg"],
	tiles: [
		"/images/pexels/tile-1.jpg",
		"/images/pexels/tile-2.jpg",
		"/images/pexels/tile-3.jpg",
		"/images/pexels/tile-4.jpg",
	],
	looks: ["/images/pexels/look-1.jpg", "/images/pexels/look-2.jpg"],
	imageText: "/images/pexels/image-text.jpg",
	band: ["/images/pexels/band-1.jpg", "/images/pexels/band-2.jpg", "/images/pexels/band-3.jpg"],
} as const;

/** The `index`th photo of a set, wrapping, so any number of slots gets a picture. */
export function editorial(set: readonly string[], index: number): string {
	return set[index % set.length] ?? EDITORIAL.imageText;
}

const stills = (images: string[] | null | undefined) => (images ?? []).filter((url) => !isVideoUrl(url));

/** A manual collection with no members opens an empty page, so it never gets a tile, tab or link. */
function hasMembers(collection: {
	productCollections?: unknown[] | null;
	metafieldRules?: unknown[] | null;
	filter?: { type?: string } | null;
}) {
	if (collection.filter && collection.filter.type !== "manual") return true;
	return (collection.productCollections?.length ?? 0) > 0 || (collection.metafieldRules?.length ?? 0) > 0;
}

export type Tile = {
	href: string;
	title: string;
	description: string;
	image: string;
	kind: "category" | "collection";
};

/**
 * The store's categories and collections that hold products, for the mosaic, the tab band, the
 * mega menu and the footer. Each carries an editorial photo by position (collections first).
 */
export async function getCatalogueTiles() {
	"use cache";
	cacheLife("minutes");

	const [facets, collections] = await Promise.all([
		commerce.productFilters().catch(() => ({ categories: [] })),
		commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] })),
	]);
	const counted = await Promise.all(
		facets.categories.map(async (category) => {
			const result = await commerce
				.productBrowse({ active: true, category: category.slug, limit: 1 })
				.catch(() => ({ data: [], meta: { count: 0 } }));
			return { category, count: result.meta.count };
		}),
	);
	const collectionTiles = collections.data.filter(hasMembers).map((c, i) => ({
		href: `/collection/${c.slug}`,
		title: c.name,
		description: plainText(c.description),
		image: editorial(EDITORIAL.tiles, i),
		kind: "collection" as const,
	}));
	const categoryTiles = counted
		.filter((c) => c.count > 0)
		.map(({ category }, i) => ({
			href: `/category/${category.slug}`,
			title: displayName(category.name),
			description: "",
			image: editorial(EDITORIAL.tiles, collectionTiles.length + i),
			kind: "category" as const,
		}));
	return { categories: categoryTiles, collections: collectionTiles };
}

export type LookProduct = { slug: string; name: string; image: string | null; price: string | null };

export type Look = {
	slug: string;
	name: string;
	description: string;
	products: LookProduct[];
};

/**
 * Collections with their members resolved to name, photo and display price: drives the
 * shop-the-look hotspots.
 */
export async function getLooks(): Promise<Look[]> {
	"use cache";
	cacheLife("minutes");

	const [collections, { currency, locale, taxBehavior }] = await Promise.all([
		commerce.collectionBrowse({ limit: 6 }).catch(() => ({ data: [] })),
		getStoreConfig(),
	]);
	return Promise.all(
		collections.data.filter(hasMembers).map(async (c) => {
			const full = await commerce.collectionGet({ idOrSlug: c.slug }).catch(() => null);
			const members = (full?.productCollections ?? []).slice(0, 4);
			const products = await Promise.all(
				members.map(async ({ product }) => {
					const detail = await commerce.productGet({ idOrSlug: product.slug }).catch(() => null);
					const variant = detail?.variants[0];
					const price = variant ? displayPrice(variant, taxBehavior) : null;
					return {
						slug: product.slug,
						name: product.name,
						image: stills(product.images)[0] ?? null,
						price: price ? formatMoney({ amount: BigInt(price), currency, locale }) : null,
					};
				}),
			);
			return {
				slug: c.slug,
				name: c.name,
				description: plainText(c.description),
				products,
			};
		}),
	);
}

export async function getSocialLinks() {
	"use cache";
	cacheLife("hours");
	const labels: Record<string, string> = {
		instagram: "Instagram",
		facebook: "Facebook",
		x: "X",
		youtube: "YouTube",
		linkedin: "LinkedIn",
		tiktok: "TikTok",
		pinterest: "Pinterest",
	};
	const socials = await commerce.socialsGet().catch(() => null);
	return Object.entries(socials?.socials ?? {}).flatMap(([network, url]) =>
		typeof url === "string" && url && labels[network] ? [{ label: labels[network], url }] : [],
	);
}
