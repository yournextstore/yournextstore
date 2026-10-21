import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";

export type NavItem = { href: string; label: string };

export type NavData = {
	storeName: string;
	categories: NavItem[];
	collections: NavItem[];
	blog: boolean;
	contact: boolean;
};

/** Everything the header, mobile menu and footer list. Cached so the chrome stays in the prerendered shell. */
export async function getNavData(): Promise<NavData> {
	"use cache";
	cacheLife("hours");
	const [categories, collections, me] = await Promise.all([
		commerce.categoriesBrowse({ limit: 50 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	return {
		storeName: me?.store.settings?.storeName || me?.store.name || "Your Next Store",
		categories: categories.data
			.filter((category) => !category.parentId)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
		// A manual collection with no members (and no rules) would open on an empty page.
		collections: collections.data
			.filter(
				(collection) =>
					collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0,
			)
			.map((collection) => ({
				href: `/collection/${collection.slug}`,
				label: collection.name,
			})),
		blog: me?.store.settings?.enabledTools?.blog ?? false,
		contact: me?.store.settings?.enabledTools?.contactForm ?? false,
	};
}

export type Tile = { href: string; title: string; image: string | null };

/** Bundled store photographs (see NOTICE.md), one per tile tone: tangerine, aqua, rose, violet, teal. */
export const TILE_PHOTOS = [
	"/images/pexels/tile-yellow-flatlay.jpg",
	"/images/pexels/tile-aqua-sunglasses.jpg",
	"/images/pexels/tile-pink-sunglasses.jpg",
	"/images/pexels/tile-blue-lenses.jpg",
	"/images/pexels/tile-tote-yellow.jpg",
] as const;

/** The about page's photo stack, also bundled store photographs. */
export const ABOUT_PHOTOS = [
	"/images/pexels/about-blue-flatlay.jpg",
	"/images/pexels/about-bag-card.jpg",
	"/images/pexels/about-rainbow-tote.jpg",
] as const;

/**
 * The home "blocks grid": one wide catalogue banner plus five tiles. The banner previews the store's
 * own product photos; the tiles are its categories and collections that hold products, each over a
 * bundled lifestyle photograph in its tone.
 */
export async function getHomeTiles(): Promise<{ catalog: string[]; tiles: Tile[] }> {
	"use cache";
	cacheLife("hours");
	const [products, nav] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] })),
		getNavData(),
	]);
	const firstImage = (p: (typeof products.data)[number]) =>
		p.images?.find((src) => !/\.(mp4|webm|mov)$/i.test(src));
	const stocked = new Set(products.data.map((p) => p.category?.slug).filter(Boolean));
	const categories = nav.categories.filter((category) => stocked.has(category.href.split("/").at(-1)));
	const tiles: Tile[] = [...categories, ...nav.collections]
		.slice(0, TILE_PHOTOS.length)
		.map((item, i) => ({ href: item.href, title: item.label, image: TILE_PHOTOS[i] ?? null }));
	const catalog = [
		...new Set(products.data.map(firstImage).filter((src): src is string => Boolean(src))),
	].slice(0, 4);
	return { catalog, tiles };
}

/** Upper-case the first letter of a catalogue label that arrives in lower case (some stores name categories that way). */
export function sentenceCase(label: string) {
	return label.charAt(0).toUpperCase() + label.slice(1);
}
