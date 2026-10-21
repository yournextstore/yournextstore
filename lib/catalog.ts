import type { APICollectionsBrowseResult, APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";

export type CatalogProduct = APIProductsBrowseResult["data"][number];
export type CatalogCollection = APICollectionsBrowseResult["data"][number];

/** Collection descriptions are plain text or TipTap JSON; tiles and banners want one line of text. */
export function flattenDescription(description: unknown): string | null {
	if (typeof description === "string") {
		const text = description.trim();
		return text.length > 0 ? text : null;
	}
	if (description && typeof description === "object") {
		const parts: string[] = [];
		const walk = (node: unknown) => {
			if (!node || typeof node !== "object") return;
			if ("text" in node && typeof node.text === "string") parts.push(node.text);
			if ("content" in node && Array.isArray(node.content)) node.content.map(walk);
		};
		walk(description);
		const text = parts.join(" ").trim();
		return text.length > 0 ? text : null;
	}
	return null;
}

export type Shelf = {
	title: string;
	kicker: string;
	href: string;
	allLabel: string;
	products: CatalogProduct[];
};

export type Tile = {
	href: string;
	title: string;
	description: string | null;
	image: string | null;
};

const SHELF_SIZE = 8;

/** Bundled photographs: the original's Unsplash hero and Pexels editorial shots (see NOTICE.md). */
export const editorial = {
	hero: "/images/hero.jpg",
	banner: "/images/pexels/banner-suitcase.jpg",
	about: "/images/pexels/about-olive-bag.jpg",
	tiles: [
		"/images/pexels/tile-olive-bag.jpg",
		"/images/pexels/tile-leather-table.jpg",
		"/images/pexels/tile-wicker.jpg",
	],
};
const tilePhoto = (index: number) => editorial.tiles[index % editorial.tiles.length] ?? editorial.hero;

/** Photographed, priced products first; the rest keep their order at the end. */
export function photographedFirst<P extends { images: string[]; variants: { price: string }[] }>(
	products: readonly P[],
): P[] {
	const leads = (p: P) => p.images.length > 0 && p.variants.some((v) => Number(v.price) > 0);
	return [...products.filter(leads), ...products.filter((p) => !leads(p))];
}

/**
 * Everything the home page renders, in one cached read: the staggered tiles (collections and
 * categories with products, then "shop all"), and up to three product shelves. A collection gets
 * its own shelf once it holds three products; photographed products lead every shelf.
 */
export async function getHomeData() {
	"use cache";
	cacheLife("minutes");

	const [browsed, allCollections, categories, me] = await Promise.all([
		commerce
			.productBrowse({ active: true, limit: 48, orderBy: "createdAt", orderDirection: "desc" })
			.then((r) => r.data),
		commerce.collectionBrowse({ limit: 5 }).then((r) => r.data),
		commerce
			.categoriesBrowse({ active: true, limit: 50 })
			.then((r) => r.data)
			.catch(() => []),
		meGetCached().catch(() => null),
	]);
	const products = photographedFirst(browsed);
	const storeName = me?.store.settings?.storeName || me?.store.name || "Store";
	const membersOf = (collection: CatalogCollection) => {
		const ids = new Set(collection.productCollections.map((pc) => pc.productId));
		return products.filter((p) => ids.has(p.id));
	};
	// An empty collection would only lead to a blank page.
	const collections = allCollections.filter((collection) => membersOf(collection).length > 0);
	const stockedCategories = categories.filter(
		(category) => !category.parentId && products.some((p) => p.categoryId === category.id),
	);

	// Two tiles and a centred "shop all" keep the staggered 2-1 rhythm whole.
	const sections = [
		...collections.map((collection) => ({
			href: `/collection/${collection.slug}`,
			title: collection.name,
			description: flattenDescription(collection.description),
		})),
		...stockedCategories.map((category) => ({
			href: `/category/${category.slug}`,
			title: category.name,
			description: flattenDescription(category.description),
		})),
	].slice(0, 2);
	const tiles: Tile[] = [
		...sections.map((section, index) => ({ ...section, image: tilePhoto(index) })),
		{
			href: "/products",
			title: "Shop all",
			description: "Everything in the shop, in one place.",
			image: tilePhoto(sections.length),
		},
	];

	const collectionShelves: Shelf[] = collections
		.map((collection) => ({ collection, members: membersOf(collection) }))
		.filter(({ members }) => members.length >= 3)
		.slice(0, 2)
		.map(({ collection, members }) => ({
			title: collection.name,
			kicker: collection.name,
			href: `/collection/${collection.slug}`,
			allLabel: `All of ${collection.name}`,
			products: members.slice(0, SHELF_SIZE),
		}));

	const newest: Shelf = {
		title: "New arrivals",
		kicker: "New in",
		href: "/products",
		allLabel: "All products",
		products: products.slice(0, SHELF_SIZE),
	};
	const more: Shelf = {
		title: "More to explore",
		kicker: storeName,
		href: "/products",
		allLabel: "Shop everything",
		products: products.slice(SHELF_SIZE, SHELF_SIZE * 2),
	};

	const shelves = [newest, ...collectionShelves, ...(collectionShelves.length === 0 ? [more] : [])].filter(
		(shelf) => shelf.products.length > 0,
	);

	return { storeName, tiles, shelves };
}
