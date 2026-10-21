import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";
import { isVideoUrl } from "@/lib/utils";

// One browse backs the home page sections, the header's category menu and the about page,
// so every section can share products without repeating any and the chrome stays in the shell.
async function getCatalogProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 100 }).catch(() => ({ data: [] }));
	return data;
}

export type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>[number];

export function stills(images: readonly string[]) {
	return images.filter((image) => !isVideoUrl(image));
}

const inStock = (product: CatalogProduct) => product.variants.some((variant) => variant.stock !== 0);

export type CatalogCategory = {
	name: string;
	slug: string;
	count: number;
	image: string | null;
};

/** Top-level categories that hold products, largest first, each pictured by one of its products. */
export async function getCatalogCategories(): Promise<CatalogCategory[]> {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const bySlug = new Map<string, CatalogCategory>();
	const usedImages = new Set<string>();
	for (const product of products) {
		const category = product.category;
		if (!category || category.parentId) continue;
		const entry = bySlug.get(category.slug) ?? {
			name: sentenceCase(category.name),
			slug: category.slug,
			count: 0,
			image: typeof category.image === "string" ? category.image : null,
		};
		// A category without its own image takes the main photo of one of its products, never one
		// another tile already uses.
		const candidate = entry.image ? null : (stills(product.images)[0] ?? null);
		const image = entry.image ?? (candidate && !usedImages.has(candidate) ? candidate : null);
		if (image) usedImages.add(image);
		bySlug.set(category.slug, { ...entry, count: entry.count + 1, image });
	}
	return [...bySlug.values()].sort((a, b) => b.count - a.count);
}

/** Plain text of a TipTap document (collection descriptions arrive as JSON). */
export function plainText(node: unknown): string {
	if (typeof node === "string") return node;
	if (!node || typeof node !== "object") return "";
	const { text, content } = node as { text?: unknown; content?: unknown };
	const own = typeof text === "string" ? text : "";
	const children = Array.isArray(content) ? content.map(plainText).join(" ") : "";
	return `${own}${children}`.replace(/\s+/g, " ").trim();
}

/** The first active collection with products, to headline the home promo band; null when there is none. */
export async function getFeaturedCollection() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.collectionBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] }));
	// Skip collections that hold no products yet, so the band never leads to an empty page.
	const collection = data.find((entry) => entry.productCollections.length > 0);
	if (!collection) return null;
	return {
		name: collection.name,
		slug: collection.slug,
		description: plainText(collection.description) || null,
	};
}

/** Home-page products: the newest pictured products, in-stock ones first. */
export async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const pictured = products.filter((product) => stills(product.images).length > 0);
	const latest = [...pictured]
		.sort(
			(a, b) =>
				Number(inStock(b)) - Number(inStock(a)) ||
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		)
		.slice(0, 8);
	return latest;
}

export async function getStoreIdentity() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	const settings = me?.store.settings;
	return {
		storeName: settings?.storeName || me?.store.name || "Your Next Store",
		storeDescription: settings?.storeDescription || null,
		contactFormEnabled: settings?.enabledTools?.contactForm ?? false,
		blogEnabled: settings?.enabledTools?.blog ?? false,
	};
}
