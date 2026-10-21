import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { isVideoUrl, labelCase } from "@/lib/utils";

export type CatalogLink = { href: string; label: string };

export type CategoryTile = CatalogLink & { image: string | null; count: number };

const stills = (images: readonly string[] | null | undefined) =>
	(images ?? []).filter((image) => !isVideoUrl(image));

/** The store's display name: the name set in settings, else the store record's. */
export async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Your Next Store";
}

/**
 * The shelf the original calls "collections": the store's collections that hold products,
 * topped up with its top-level categories so the shelf has at least four tiles when it can.
 * Each tile is pictured by its own image or the first photographed product in it.
 */
export async function getShelf(): Promise<CategoryTile[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, categories] = await Promise.all([
		commerce.collectionBrowse({ limit: 12 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
	]);
	const tile = async (
		href: string,
		label: string,
		image: string | null | undefined,
		filter: { collection: string } | { category: string },
	) => {
		const products = await commerce
			.productBrowse({ active: true, limit: 8, ...filter })
			.catch(() => ({ data: [], meta: { count: 0 } }));
		const still = products.data.flatMap((product) => stills(product.images))[0] ?? null;
		return { href, label, image: image ?? still, count: products.meta.count };
	};
	const collectionTiles = (
		await Promise.all(
			collections.data
				.filter((collection) => collection.active)
				.map((collection) =>
					tile(`/collection/${collection.slug}`, collection.name, collection.image, {
						collection: collection.slug,
					}),
				),
		)
	).filter((entry) => entry.count > 0);
	if (collectionTiles.length >= 4) return collectionTiles;
	const categoryTiles = (
		await Promise.all(
			categories.data
				.filter((category) => !category.parentId)
				.map((category) =>
					tile(`/category/${category.slug}`, labelCase(category.name), category.image, {
						category: category.slug,
					}),
				),
		)
	)
		.filter((entry) => entry.count > 0)
		.sort((a, b) => b.count - a.count);
	return [...collectionTiles, ...categoryTiles];
}

/** Header, menu and footer data. */
export async function getNavData() {
	"use cache";
	cacheLife("hours");
	const [shelf, storeName, me] = await Promise.all([
		getShelf(),
		getStoreName(),
		meGetCached().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	return {
		storeName,
		storeDescription: me?.store.settings?.storeDescription || null,
		shelf: shelf.map(({ href, label }) => ({ href, label })),
		pages: [
			{ href: "/about", label: "About" },
			{ href: "/faq", label: "FAQ" },
			...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
			...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		],
	};
}

/** Total published pieces, for the "N pieces" counters. */
export async function getPieceCount() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce.productBrowse({ active: true, limit: 1 }).catch(() => null);
	return result?.meta.count ?? 0;
}

/** Collection descriptions are TipTap JSON; headers want their plain text. */
export function flattenRichText(value: unknown): string {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map(flattenRichText).join(" ");
	if (value && typeof value === "object") {
		const node = value as { text?: unknown; content?: unknown };
		return typeof node.text === "string" ? node.text : flattenRichText(node.content);
	}
	return "";
}
