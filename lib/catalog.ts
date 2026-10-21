import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { capitalize, isVideoUrl } from "@/lib/utils";

export { capitalize };

// One browse backs the home page, the header nav and the footer, so sections share products
// without repeating any and the chrome stays in the prerendered shell.
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
			name: category.name,
			slug: category.slug,
			count: 0,
			image: typeof category.image === "string" ? category.image : null,
		};
		// Without its own image a category takes the main photo of one of its products, never one
		// another tile already uses.
		const candidate = entry.image ? null : (stills(product.images)[0] ?? null);
		const image = entry.image ?? (candidate && !usedImages.has(candidate) ? candidate : null);
		if (image) usedImages.add(image);
		bySlug.set(category.slug, { ...entry, count: entry.count + 1, image });
	}
	return [...bySlug.values()].sort((a, b) => b.count - a.count);
}

/** Pictured products of one category (or of the whole shop), in stock first, then newest. */
export async function getShelfProducts(categorySlug: string | null, limit = 4) {
	"use cache";
	cacheLife("minutes");
	const products = await getCatalogProducts();
	const available = (product: CatalogProduct) => product.variants.some((variant) => variant.stock !== 0);
	// In-stock products lead; sold-out ones only fill the row so it never shows a lone card.
	return products
		.filter((product) => stills(product.images).length > 0)
		.filter((product) => !categorySlug || product.category?.slug === categorySlug)
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.sort((a, b) => Number(available(b)) - Number(available(a)))
		.slice(0, limit);
}

export async function getProductCount() {
	"use cache";
	cacheLife("minutes");
	return (await getCatalogProducts()).length;
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
		reviewsEnabled: settings?.enabledTools?.reviews ?? false,
	};
}

/** Splits a plain-text summary into paragraphs, dropping a first line that only repeats the name. */
export function summaryParagraphs(summary: string | null | undefined, productName: string) {
	const name = productName.replace(/\s+/g, " ").trim().toLowerCase();
	const paragraphs = (summary ?? "")
		.split(/\r?\n/)
		.map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
		.filter((paragraph) => paragraph && paragraph.toLowerCase() !== name);
	return [...new Set(paragraphs)];
}
