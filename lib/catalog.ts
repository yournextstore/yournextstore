import type { APICollectionsBrowseResult, APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { pickEditorial } from "@/lib/editorial";

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
	eyebrow: string;
	href: string;
	allLabel: string;
	products: CatalogProduct[];
};

export type Tile = {
	href: string;
	title: string;
	count: number;
	image: string | null;
};

const SHELF_SIZE = 8;
const EYEBROWS = ["Most loved", "Selected", "Just in"];

type CategoryNode = { id: string; slug: string; name: string; parentId: string | null };

async function getCategories(): Promise<CategoryNode[]> {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] }));
	return data.map((c) => ({ id: c.id, slug: c.slug, name: c.name, parentId: c.parentId ?? null }));
}

/** Category name by id: the small uppercase kicker centred on top of every product card. */
export async function getCategoryNames(): Promise<Record<string, string>> {
	"use cache";
	cacheLife("hours");
	const categories = await getCategories();
	return Object.fromEntries(categories.map((c) => [c.id, c.name]));
}

/** `/category/parent/child`: the category page redirects any other path to this canonical one. */
function categoryHref(category: CategoryNode, all: CategoryNode[]) {
	const parent = category.parentId ? all.find((c) => c.id === category.parentId) : null;
	return `/category/${parent ? `${parent.slug}/` : ""}${category.slug}`;
}

/** Top-level categories for the header and the fullscreen menu. */
export async function getNavCategories() {
	"use cache";
	cacheLife("hours");
	const categories = await getCategories();
	return categories
		.filter((c) => !c.parentId)
		.map((c) => ({ href: categoryHref(c, categories), label: c.name }));
}

/**
 * Everything the home page renders, in one cached read: six category tiles over the hero
 * (top-level categories first, then their children, then collections to fill), and up to three
 * product shelves, one per collection that holds three products or more. The newest products
 * stand in when the store has no such collection.
 */
export async function getHomeData() {
	"use cache";
	cacheLife("minutes");

	const [browsed, collections, categories, me] = await Promise.all([
		commerce
			.productBrowse({ active: true, limit: 48, orderBy: "createdAt", orderDirection: "desc" })
			.then((r) => r.data),
		commerce.collectionBrowse({ limit: 12 }).then((r) => r.data),
		getCategories(),
		meGetCached().catch(() => null),
	]);
	const storeName = me?.store.settings?.storeName || me?.store.name || "Store";
	// Pictured products first, so a shelf never opens on an empty placeholder.
	const pictured = (p: CatalogProduct) =>
		p.images.length > 0 || p.variants.some((v) => (v.images?.length ?? 0) > 0);
	const products = [...browsed.filter(pictured), ...browsed.filter((p) => !pictured(p))];
	const membersOf = (collection: CatalogCollection) => {
		const ids = new Set(collection.productCollections.map((pc) => pc.productId));
		return products.filter((p) => ids.has(p.id));
	};

	const tops = categories.filter((c) => !c.parentId);
	const children = categories.filter((c) => c.parentId);
	const categoryTiles = [...tops, ...children].map((category) => {
		const ids = new Set([
			category.id,
			...children.filter((c) => c.parentId === category.id).map((c) => c.id),
		]);
		const members = products.filter((p) => p.categoryId && ids.has(p.categoryId));
		return { category, members };
	});

	const browsables = [
		...categoryTiles
			.filter(({ members }) => members.length > 0)
			.map(({ category, members }) => ({
				href: categoryHref(category, categories),
				title: category.name,
				count: members.length,
			})),
		...collections
			.filter((c) => !categories.some((cat) => cat.slug === c.slug))
			.map((collection) => {
				const members = membersOf(collection);
				return {
					href: `/collection/${collection.slug}`,
					title: collection.name,
					count: members.length,
				};
			})
			.filter((tile) => tile.count > 0),
	].slice(0, 6);
	if (browsables.length < 3) {
		browsables.push({ href: "/products", title: "Shop all", count: products.length });
	}
	// Whole rows of three on desktop; the offset middle column needs a full row to read.
	const rowFill =
		browsables.length >= 3 ? browsables.slice(0, Math.floor(browsables.length / 3) * 3) : browsables;
	const tileImages = pickEditorial(rowFill.map((tile) => tile.title));
	const tiles: Tile[] = rowFill.map((tile, i) => ({ ...tile, image: tileImages[i] ?? null }));

	const collectionShelves: Shelf[] = collections
		.map((collection) => ({ collection, members: membersOf(collection) }))
		.filter(({ members }) => members.length >= 3)
		.slice(0, 3)
		.map(({ collection, members }, i) => ({
			title: collection.name,
			eyebrow: EYEBROWS[i] ?? storeName,
			href: `/collection/${collection.slug}`,
			allLabel: `All ${collection.name}`,
			products: members.slice(0, SHELF_SIZE),
		}));

	const fallbackShelves: Shelf[] = [
		{
			title: "New arrivals",
			eyebrow: "Just in",
			href: "/products",
			allLabel: "All products",
			products: products.slice(0, SHELF_SIZE),
		},
		{
			title: "More to explore",
			eyebrow: storeName,
			href: "/products",
			allLabel: "Shop everything",
			products: products.slice(SHELF_SIZE, SHELF_SIZE * 2),
		},
	];

	// One collection shelf alone reads thin: follow it with the newest products.
	const shelves = (
		collectionShelves.length > 1 ? collectionShelves : [...collectionShelves, ...fallbackShelves].slice(0, 2)
	).filter((shelf) => shelf.products.length > 0);

	const threshold = me?.store.settings?.freeShippingThreshold;
	return {
		storeName,
		tiles,
		shelves,
		freeShippingThreshold: threshold && /^\d+$/.test(String(threshold)) ? String(threshold) : null,
		productCount: products.length,
		heroProduct: products[0] ?? null,
	};
}
